import { Droplets, Zap, Leaf, Dumbbell, Plus } from "lucide-react"
import { PhotoGrid } from "@/components/PhotoGrid"
import { Pop } from "@/components/store/Motion"
import { FLAVORS, selectFlavor } from "@/components/store/flavors"
import { PRICE_ONE } from "@/components/store/BuyRail"

export const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0z" /></svg>
)

export function Ticker() {
  const words = ["بدون سكر", "نكهة البرتقال", "طاقة بالأحماض الأمينية", "الدفع عند الاستلام", "Verified for Sport"]
  return (
    <div className="overflow-hidden bg-primary py-3.5 text-primary-foreground" dir="ltr">
      <div className="zest-marquee flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-10 pe-10">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="font-heavy flex items-center gap-10 whitespace-nowrap text-2xl">{w}<Sparkle className="zest-twinkle h-5 w-5 text-accent" /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Pop><h2 className="text-5xl md:text-7xl leading-[1.1]">يومك يبدا بنكهة.</h2></Pop>
      <Pop delay={0.1}><p className="mt-3 max-w-xl text-muted-foreground">من الصباح للجيم، للشاطئ، للدراسة — علبة وحدة تكفي.</p></Pop>
      <Pop delay={0.15} className="mt-8">
        <PhotoGrid
          items={[
            { src: "/assets/lifestyle-1.webp", alt: "امرأة رياضية تشرب مشروب البرتقال", caption: "قبل التمرين" },
            { src: "/assets/oranges.webp", alt: "شرائح برتقال طازجة" },
            { src: "/assets/product.webp", alt: "علبة أكوتس بنكهة البرتقال" },
            { src: "/assets/lifestyle-2.webp", alt: "شاب في الجيم" },
            { src: "/assets/drink.webp", alt: "كأس مشروب برتقال بارد" },
          ]}
        />
      </Pop>
    </section>
  )
}

export function Why() {
  const rows = [
    { Icon: Zap, t: "طاقة بالأحماض الأمينية", d: "تركيبة «Amino-Charged Energy» معمولة باش تعاونك في وقت التمرين." },
    { Icon: Leaf, t: "بدون سكر", d: "نكهة منعشة من غير سكر مضاف." },
    { Icon: Droplets, t: "تتخلط في ثواني", d: "ملعقة في الماء الباردة وتولّي جاهز للشرب." },
    { Icon: Dumbbell, t: "مفحوص للرياضيين", d: "علامة Verified for Sport: مفحوص من المواد المحظورة." },
  ]
  return (
    <section className="bg-secondary/70 py-16 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <Pop>
          <h2 className="text-5xl md:text-7xl leading-[1.1]">علاش أكوتس؟</h2>
          <div className="mt-8 overflow-hidden rounded-t-[10rem] rounded-b-[2rem] border-2 border-primary/20">
            <img src="/assets/oranges.webp" alt="برتقال بالماء المتناثر" className="aspect-[4/5] w-full object-cover transition-transform duration-1000 hover:scale-105" loading="lazy" />
          </div>
        </Pop>
        <ul className="divide-y divide-border self-center">
          {rows.map(({ Icon, t, d }, i) => (
            <Pop as="li" key={t} delay={i * 0.1} className="group flex gap-5 py-7">
              <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"><Icon className="h-6 w-6 text-accent-foreground" /></span>
              <div><h3 className="text-3xl">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p></div>
            </Pop>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Flavors() {
  const pick = (id: string) => {
    selectFlavor(id)
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <Pop><h2 className="text-5xl md:text-7xl leading-[1.1]">اختار نكهتك.</h2></Pop>
      <Pop delay={0.1}><p className="mt-3 max-w-xl text-muted-foreground">نفس الطاقة، نفس التركيبة بدون سكر — بخمس نكهات.</p></Pop>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {FLAVORS.map((f, i) => (
          <Pop key={f.id} delay={i * 0.08}>
            <button onClick={() => pick(f.id)} style={{ background: f.bg }} className="group block w-full rounded-[2rem] p-3 text-start text-foreground transition duration-300 hover:-translate-y-2 hover:shadow-xl md:p-4">
              <div className="overflow-hidden rounded-t-[6rem] rounded-b-[1.25rem]">
                <img src={f.img} alt={"نكهة " + f.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <h3 className="mt-4 text-3xl">{f.name}</h3>
              <p className="text-sm font-bold">{PRICE_ONE} د.ت للعلبة</p>
              <span className="mt-3 inline-block rounded-full bg-foreground px-4 py-2 text-sm font-black text-background transition group-hover:bg-primary group-hover:text-primary-foreground">اطلبها</span>
            </button>
          </Pop>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">* النكهات وصورها للعرض حاليًا — تتبدّل بنكهاتك الحقيقية.</p>
    </section>
  )
}

export function Faq() {
  const f = [
    ["كيفاش نخلّط أكوتس؟", "تخلط الكمية المكتوبة على العلبة في الماء الباردة وتشربها."],
    ["كيفاش ندفع؟", "الدفع عند الاستلام: تخلّص كي توصلك العلبة."],
    ["وين توصلو؟", "نوصلو لكل ولايات تونس."],
    ["شنوّة معناها Verified for Sport؟", "المنتج مفحوص من المواد المحظورة في الرياضة."],
  ]
  return (
    <section className="mx-auto max-w-3xl px-5 pb-20">
      <Pop><h2 className="text-5xl md:text-6xl">أسئلة تتعاود</h2></Pop>
      <div className="mt-8 space-y-3">
        {f.map(([q, a], i) => (
          <Pop key={q} delay={i * 0.06} y={24}>
            <details className="group rounded-2xl border-2 border-border bg-card px-6 py-4 transition hover:border-primary/60">
              <summary className="font-display flex cursor-pointer list-none items-center justify-between text-2xl">{q}<Plus className="h-5 w-5 text-primary transition-transform duration-300 group-open:rotate-45" /></summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          </Pop>
        ))}
      </div>
    </section>
  )
}
