import { motion } from "framer-motion"
import { Sparkle } from "@/components/store/Sections"
import { Pop } from "@/components/store/Motion"
import { useFlavor } from "@/components/store/flavors"
import BuyRail from "@/components/store/BuyRail"

export function PromoBanner({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="bg-accent p-3.5">
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-[1.75rem] bg-foreground px-8 py-12 md:grid-cols-2 md:px-14">
        <img src="/assets/oranges.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
        <Sparkle className="zest-twinkle absolute end-8 top-8 h-8 w-8 text-accent" />
        <div className="relative z-10">
          <Pop><h2 className="text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] text-background">تعال للنكهة،<br /><span className="text-accent">ابقى للطاقة.</span></h2></Pop>
          <Pop delay={0.1}><p className="mt-4 max-w-md font-semibold text-background/90">علبة وحدة، تتخلط في الماء الباردة وتولّي جاهزة. طاقة بالأحماض الأمينية من غير سكر مضاف.</p></Pop>
          <Pop delay={0.2}><button onClick={onOrder} className="mt-7 rounded-full bg-accent px-9 py-4 text-lg font-black text-accent-foreground transition hover:-translate-y-1 hover:shadow-lg active:scale-95">اطلب الآن</button></Pop>
        </div>
        <Pop className="relative z-10 flex justify-center">
          <div className="w-full max-w-xs rounded-[2rem] bg-background p-6 shadow-2xl md:max-w-sm">
            <img src="/assets/product.webp" alt="علبة أكوتس بنكهة البرتقال" className="zest-float w-full object-contain drop-shadow-xl" loading="lazy" />
          </div>
        </Pop>
      </div>
    </section>
  )
}

export function PackStack() {
  const lines = ["طاقة بالأحماض الأمينية", "بدون سكر مضاف", "نكهات تفرّح"]
  return (
    <section className="relative overflow-hidden pt-16 text-center md:pt-24" style={{ background: "linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(95 65% 40%) 50%, hsl(var(--accent)) 100%)" }}>
      <Sparkle className="zest-bob absolute start-[8%] top-24 h-14 w-14 text-accent" />
      <Sparkle className="zest-twinkle absolute end-[10%] top-1/2 h-10 w-10 text-primary-foreground/70" />
      <h2 className="px-5 text-[clamp(3rem,9vw,7.5rem)] leading-[1.1]">
        {lines.map((l, i) => <Pop as="span" key={l} delay={i * 0.12} className="block text-primary-foreground">{l}</Pop>)}
        <Pop as="span" delay={0.4} className="block text-accent">علبة وحدة مريحة</Pop>
      </h2>
      <div className="mx-auto mt-12 h-[280px] w-full max-w-md overflow-hidden px-5 md:h-[380px]">
        <motion.img
          src="/assets/product.webp" alt="علبة أكوتس" loading="lazy"
          className="w-full object-contain drop-shadow-2xl"
          initial={{ y: 220 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  )
}

export function BigHeadline({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="px-5 py-20 text-center md:py-28">
      <h2 className="text-[clamp(3.4rem,11vw,8.5rem)] leading-[1.1]">
        <Pop as="span" className="block text-primary">اشرب. نشّط.</Pop>
        <Pop as="span" delay={0.12} className="block">وابدا يومك</Pop>
        <Pop as="span" delay={0.24} className="block">بنكهة البرتقال</Pop>
      </h2>
      <Pop delay={0.3}><button onClick={onOrder} className="mt-10 rounded-full bg-primary px-10 py-4 text-lg font-black text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg active:scale-95">اطلب الآن</button></Pop>
    </section>
  )
}

export function OrderSection() {
  const flavor = useFlavor()
  const isOrange = flavor.id === "orange"
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Pop className="space-y-4">
          <div className="rounded-[2rem] p-5 transition-colors duration-500" style={{ background: isOrange ? "hsl(var(--background))" : flavor.bg }}>
            <img key={flavor.id} src={isOrange ? "/assets/product.webp" : flavor.img} alt={"أكوتس بنكهة " + flavor.name} className={"mx-auto aspect-square w-full max-w-lg animate-fade-in " + (isOrange ? "object-contain drop-shadow-xl" : "rounded-[1.5rem] object-cover")} loading="lazy" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["/assets/lifestyle-1.webp", "/assets/drink.webp", "/assets/lifestyle-2.webp"].map((s) => (
              <img key={s} src={s} alt="" className="aspect-square w-full rounded-2xl object-cover transition duration-500 hover:scale-105 hover:-rotate-2" loading="lazy" />
            ))}
          </div>
        </Pop>
        <Pop delay={0.1}><BuyRail /></Pop>
      </div>
    </section>
  )
}
