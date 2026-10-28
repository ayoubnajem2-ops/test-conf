import { useCallback, useEffect, useRef, useState } from "react"
import { GoogleGenAI, type Session } from "@google/genai"
import { supabase } from "@/lib/chantan-db"

export type CallStatus = "idle" | "connecting" | "live" | "error"

const b64FromBytes = (bytes: Uint8Array) => {
  let s = ""
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}
const bytesFromB64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
const toPcm16 = (f: Float32Array) => {
  const out = new Int16Array(f.length)
  for (let i = 0; i < f.length; i++) out[i] = Math.max(-1, Math.min(1, f[i])) * 0x7fff
  return new Uint8Array(out.buffer)
}
const downsample = (input: Float32Array, from: number, to: number) => {
  if (from === to) return input
  const ratio = from / to
  const out = new Float32Array(Math.floor(input.length / ratio))
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio), end = Math.min(input.length, Math.floor((i + 1) * ratio))
    let sum = 0
    for (let j = start; j < end; j++) sum += input[j]
    out[i] = sum / Math.max(1, end - start)
  }
  return out
}

// A short voiced "hello?"-like clip (vowel formants + pitch glide) so the model hears speech and greets first.
async function makeGreetingClip(): Promise<Float32Array> {
  const rate = 16000, secs = 1.3
  const ctx = new OfflineAudioContext(1, rate * secs, rate)
  const osc = ctx.createOscillator()
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(150, 0)
  osc.frequency.linearRampToValueAtTime(175, 0.5)
  osc.frequency.linearRampToValueAtTime(215, secs)
  const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.Q.value = 6
  f1.frequency.setValueAtTime(550, 0); f1.frequency.linearRampToValueAtTime(750, 0.6); f1.frequency.linearRampToValueAtTime(450, secs)
  const f2 = ctx.createBiquadFilter(); f2.type = "bandpass"; f2.Q.value = 8
  f2.frequency.setValueAtTime(1700, 0); f2.frequency.linearRampToValueAtTime(1200, 0.6); f2.frequency.linearRampToValueAtTime(900, secs)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, 0); gain.gain.linearRampToValueAtTime(1.6, 0.1)
  gain.gain.setValueAtTime(1.6, secs - 0.15); gain.gain.linearRampToValueAtTime(0, secs)
  osc.connect(f1); osc.connect(f2); f1.connect(gain); f2.connect(gain); gain.connect(ctx.destination)
  osc.start(); osc.stop(secs)
  return (await ctx.startRendering()).getChannelData(0)
}

export function useVoiceCall() {
  const [status, setStatus] = useState<CallStatus>("idle")
  const [error, setError] = useState("")
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const session = useRef<Session | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const inCtx = useRef<AudioContext | null>(null)
  const outCtx = useRef<AudioContext | null>(null)
  const nextAt = useRef(0)
  const sources = useRef(new Set<AudioBufferSourceNode>())
  const mutedRef = useRef(false)
  const holdMic = useRef(true)
  const live = useRef(false)
  const timer = useRef<number>()

  const cleanup = useCallback(() => {
    live.current = false
    window.clearInterval(timer.current)
    sources.current.forEach((s) => { try { s.stop() } catch { /* already stopped */ } })
    sources.current.clear()
    try { session.current?.close() } catch { /* closed */ }
    session.current = null
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
    inCtx.current?.close().catch(() => {}); inCtx.current = null
    outCtx.current?.close().catch(() => {}); outCtx.current = null
    setSpeaking(false)
  }, [])

  const end = useCallback(() => { cleanup(); setStatus("idle"); setMuted(false); mutedRef.current = false }, [cleanup])
  useEffect(() => cleanup, [cleanup])

  const toggleMute = () => { mutedRef.current = !mutedRef.current; setMuted(mutedRef.current) }

  const play = (b64: string) => {
    const ctx = outCtx.current
    if (!ctx) return
    const pcm = new Int16Array(bytesFromB64(b64).buffer)
    const buf = ctx.createBuffer(1, pcm.length, 24000)
    const ch = buf.getChannelData(0)
    for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 0x8000
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    nextAt.current = Math.max(nextAt.current, ctx.currentTime + 0.03)
    src.start(nextAt.current)
    nextAt.current += buf.duration
    sources.current.add(src)
    setSpeaking(true)
    src.onended = () => {
      sources.current.delete(src)
      if (sources.current.size === 0) setSpeaking(false)
    }
  }

  const start = async () => {
    setError(""); setStatus("connecting"); holdMic.current = true
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      }).catch(() => { throw new Error("لازم تسمح للميكروفون باش تنجم تحكي معانا.") })

      const { data, error: fnErr } = await supabase.functions.invoke("voice-token", { body: {} })
      let serverMsg = (data as { error?: string } | null)?.error
      if (fnErr && !serverMsg) {
        try { serverMsg = (await (fnErr as { context?: Response }).context?.json())?.error } catch { /* no body */ }
      }
      if (serverMsg || fnErr || !data?.token) throw new Error(serverMsg || "ما نجمناش نبداو المكالمة توّا، جرّب مرة أخرى.")

      outCtx.current = new AudioContext({ sampleRate: 24000 })
      await outCtx.current.resume()
      nextAt.current = 0
      live.current = true

      const ai = new GoogleGenAI({ apiKey: data.token, httpOptions: { apiVersion: "v1alpha" } })
      session.current = await ai.live.connect({
        model: data.model,
        config: data.clientConfig,
        callbacks: {
          onmessage: (msg) => {
            const sc = msg.serverContent
            if (sc?.interrupted) {
              sources.current.forEach((s) => { try { s.stop() } catch { /* stopped */ } })
              sources.current.clear(); nextAt.current = 0; setSpeaking(false)
            }
            sc?.modelTurn?.parts?.forEach((p) => { if (p.inlineData?.data) play(p.inlineData.data) })
          },
          onerror: (e) => { if (live.current) { cleanup(); setError("انقطع الاتصال. جرّب مرة أخرى."); setStatus("error"); console.error(e) } },
          onclose: () => { if (live.current) { cleanup(); setStatus("idle") } },
        },
      })

      // microphone → 16kHz PCM16 chunks of 100ms
      const ictx = new AudioContext()
      inCtx.current = ictx
      await ictx.resume()
      const mute0 = ictx.createGain(); mute0.gain.value = 0
      const micSrc = ictx.createMediaStreamSource(stream.current)

      let pending = new Float32Array(0)
      const send = (bytes: Uint8Array) => {
        try { session.current?.sendRealtimeInput({ audio: { data: b64FromBytes(bytes), mimeType: "audio/pcm;rate=16000" } }) } catch { /* closing */ }
      }
      const onChunk = (data: Float32Array) => {
        if (!live.current || holdMic.current) return
        const ds = downsample(data, ictx.sampleRate, 16000)
        const merged = new Float32Array(pending.length + ds.length)
        merged.set(pending); merged.set(ds, pending.length)
        let off = 0
        while (merged.length - off >= 1600) {
          const chunk = merged.subarray(off, off + 1600)
          send(mutedRef.current ? new Uint8Array(3200) : toPcm16(chunk))
          off += 1600
        }
        pending = merged.slice(off)
      }

      // Preferred: AudioWorklet loaded from a real file. Fallback: ScriptProcessor (works where worklets are blocked).
      try {
        await ictx.audioWorklet.addModule("/mic-worklet.js")
        const node = new AudioWorkletNode(ictx, "mic")
        micSrc.connect(node)
        node.connect(mute0).connect(ictx.destination)
        node.port.onmessage = (ev: MessageEvent<Float32Array>) => onChunk(ev.data)
      } catch (workletErr) {
        console.warn("AudioWorklet unavailable, using fallback", workletErr)
        const proc = ictx.createScriptProcessor(2048, 1, 1)
        proc.onaudioprocess = (ev) => onChunk(new Float32Array(ev.inputBuffer.getChannelData(0)))
        micSrc.connect(proc)
        proc.connect(mute0).connect(ictx.destination)
      }

      // paced greeting clip so the assistant speaks first
      const clip = await makeGreetingClip()
      const total = clip.length + 16000 * 1.5
      let pos = 0
      await new Promise<void>((resolve) => {
        const iv = window.setInterval(() => {
          if (!live.current) { window.clearInterval(iv); return resolve() }
          const slice = new Float32Array(1600)
          if (pos < clip.length) slice.set(clip.subarray(pos, pos + 1600))
          send(toPcm16(slice))
          pos += 1600
          if (pos >= total) { window.clearInterval(iv); resolve() }
        }, 100)
      })
      holdMic.current = false

      const max = Number(data.maxSeconds) || 180
      setSecondsLeft(max); setStatus("live")
      const t0 = Date.now()
      timer.current = window.setInterval(() => {
        const left = Math.max(0, max - Math.floor((Date.now() - t0) / 1000))
        setSecondsLeft(left)
        if (left === 0) end()
      }, 500)
    } catch (e) {
      cleanup()
      setError(e instanceof Error ? e.message : "صار مشكل، جرّب مرة أخرى.")
      setStatus("error")
    }
  }

  return { status, error, muted, speaking, secondsLeft, start, end, toggleMute }
}
