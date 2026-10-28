import { Banknote, Truck, ShoppingBag, Menu, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Sparkle } from "@/components/store/Sections"

const rise = (d: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6, ease: "easeOut" as const } })

export function Announcement() {
  return (
    <div className="bg-foreground px-4 py-2.5 text-center">
      <p className="flex items-center justify-center gap-2 text-sm font-black text-accent">
        <Sparkle className="h-3.5 w-3.5" />أكوتس متوفر الآن في تونس<Sparkle className="h-3.5 w-3.5" />
      </p>
      <p className="text-sm text-background">الدفع عند الاستلام · توصيل لكامل تونس</p>
    </div>
  )
}

export function TopBar({ onOrder }: { onOrder: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="/" className="rounded-full bg-primary/15 px-6 py-2.5 shadow-inner">
          <span className="font-heavy text-3xl text-primary">زيست</span>
        </a>
        <div className="flex items-center gap-3 rounded-full bg-primary/15 p-1.5 ps-2 shadow-inner">
          <button onClick={onOrder} className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground transition hover:-translate-y-0.5 hover:shadow-md">اطلب الآن</button>
          <button onClick={onOrder} aria-label="الطلب" className="p-1.5 text-foreground"><ShoppingBag className="h-5 w-5" /></button>
          <button onClick={onOrder} aria-label="القائمة" className="p-1.5 pe-3 text-foreground"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
    </header>
  )
}

const stats = [
  { big: "0", top: "سكر مضاف", sub: "نكهة برتقال منعشة" },
  { big: "AA", top: "أحماض أمينية", sub: "Amino-Charged Energy" },
  { big: "✓", top: "Verified for Sport", sub: "مفحوص للرياضيين" },
]

export function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-14 pt-4">
      <Sparkle className="zest-bob pointer-events-none absolute end-[3%] top-16 h-10 w-10 text-accent" />
      <Sparkle className="zest-twinkle pointer-events-none absolute bottom-24 start-[2%] h-8 w-8 text-accent" />
      <motion.p {...rise(0)} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-bold lg:justify-start">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span><span className="text-primary">ALLMAX</span> · أكوتس بنكهة البرتقال</span>
      </motion.p>
      <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
        <div className="text-center">
          <motion.h1 {...rise(0.05)} className="font-heavy text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[1.15]">
            طاقة بالأحماض الأمينية في علبة وحدة. <span className="text-primary">من غير سكر.</span>
          </motion.h1>
          <motion.div {...rise(0.15)}>
            <button onClick={onOrder} className="mt-7 w-full max-w-sm rounded-full bg-primary px-8 py-4 text-lg font-black text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              اطلب أكوتس الآن — الدفع عند الاستلام
            </button>
            <p className="mt-3 flex items-center justify-center gap-5 text-xs font-bold">
              <span className="flex items-center gap-1.5"><Banknote className="h-4 w-4" />الدفع عند الاستلام</span>
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" />توصيل لكامل تونس</span>
            </p>
          </motion.div>
          <motion.div {...rise(0.25)} className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.top} className="flex flex-col items-center">
                <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-accent font-heavy text-4xl text-accent-foreground transition-transform duration-300 hover:rotate-6 hover:scale-110">{s.big}</div>
                <p className="font-heavy mt-2 text-lg leading-tight">{s.top}</p>
                <p className="mt-1 text-[11px] font-bold leading-tight">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div {...rise(0.1)} className="relative">
          <img src="/assets/lifestyle-1.webp" alt="امرأة رياضية تشرب مشروب أكوتس بالبرتقال" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl transition-transform duration-700 hover:scale-[1.02] lg:aspect-[4/3.2]" />
          <div className="zest-wobble absolute -start-3 -top-5 flex h-28 w-28 -rotate-12 flex-col items-center justify-center rounded-full border-4 border-accent bg-foreground text-center shadow-lg md:h-32 md:w-32">
            <Sparkle className="h-4 w-4 text-accent" />
            <span className="font-heavy text-lg leading-tight text-accent md:text-xl">بدون<br />سكر</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
