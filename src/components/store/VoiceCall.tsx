import { useState } from "react"
import { Phone, PhoneOff, Mic, MicOff, X, Loader2 } from "lucide-react"
import { useVoiceCall } from "./useVoiceCall"

const fmt = (s: number) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0")

export default function VoiceCall() {
  const [open, setOpen] = useState(false)
  const call = useVoiceCall()
  const busy = call.status === "connecting" || call.status === "live"

  const close = () => { call.end(); setOpen(false) }

  return (
    <div className="fixed bottom-20 start-4 z-50 lg:bottom-6">
      {open && (
        <div className="mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-[1.75rem] border-2 border-primary/20 bg-card p-5 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heavy text-2xl leading-none">أيوب</p>
              <p className="mt-1 text-xs font-bold text-muted-foreground">مساعد زيست الصوتي · يشرحلك أكوتس</p>
            </div>
            <button onClick={close} aria-label="إغلاق" className="rounded-full p-1.5 text-foreground transition hover:bg-primary/10"><X className="h-4 w-4" /></button>
          </div>

          <div className="my-5 flex h-16 items-center justify-center gap-1.5" aria-hidden>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={"w-1.5 rounded-full bg-primary transition-all duration-300 " + (call.speaking ? "animate-pulse" : "")}
                style={{ height: call.speaking ? 18 + ((i * 17) % 40) : 8, animationDelay: i * 90 + "ms" }}
              />
            ))}
          </div>

          <p className="min-h-[2.5rem] text-center text-sm font-bold" role="status">
            {call.status === "idle" && "اضغط «ابدأ المكالمة» وحكي معاي، نجاوبك على أي سؤال على المنتج."}
            {call.status === "connecting" && "نوصلولك أيوب… وإذا طلب المتصفح الميكروفون، اسمحلو."}
            {call.status === "live" && (call.speaking ? "أيوب يحكي…" : call.muted ? "الميكروفون مسكّر" : "ريتك تسمع، احكي") }
            {call.status === "error" && <span className="text-destructive">{call.error}</span>}
          </p>

          {call.status === "live" && <p className="mt-1 text-center text-xs text-muted-foreground">الوقت المتبقي {fmt(call.secondsLeft)}</p>}

          <div className="mt-4 flex items-center justify-center gap-3">
            {call.status === "live" && (
              <button onClick={call.toggleMute} aria-label={call.muted ? "فتح الميكروفون" : "تسكير الميكروفون"} className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card transition hover:-translate-y-0.5">
                {call.muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            {busy ? (
              <button onClick={call.end} disabled={call.status === "connecting"} className="flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-black text-destructive-foreground transition hover:-translate-y-0.5 disabled:opacity-60">
                {call.status === "connecting" ? <Loader2 className="h-5 w-5 animate-spin" /> : <PhoneOff className="h-5 w-5" />}
                {call.status === "connecting" ? "نتّصل…" : "سكّر المكالمة"}
              </button>
            ) : (
              <button onClick={call.start} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                <Phone className="h-5 w-5" />{call.status === "error" ? "جرّب مرة أخرى" : "ابدأ المكالمة"}
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] leading-snug text-muted-foreground">المساعد ذكاء اصطناعي، والمكالمة أقصاها 3 دقايق. للطلب استعمل الفورم في الصفحة.</p>
        </div>
      )}

      {!open && (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-black text-accent-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
          <Phone className="h-5 w-5" />كلّمنا
        </button>
      )}
    </div>
  )
}
