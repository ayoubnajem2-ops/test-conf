import { useState } from "react"
import { Check, Minus, Plus, ShieldCheck, Truck, Banknote } from "lucide-react"
import { FLAVORS, selectFlavor, useFlavor } from "./flavors"

// ✏️ Edit these three values to match your real shop.
export const WHATSAPP_NUMBER = "21600000000"
export const PRICE_ONE = 89
export const PRICE_TWO = 159

const GOVS = ["تونس", "أريانة", "بن عروس", "منوبة", "نابل", "زغوان", "بنزرت", "باجة", "جندوبة", "الكاف", "سليانة", "القيروان", "القصرين", "سيدي بوزيد", "سوسة", "المنستير", "المهدية", "صفاقس", "قفصة", "توزر", "قبلي", "قابس", "مدنين", "تطاوين"]

export default function BuyRail() {
  const flavor = useFlavor()
  const [plan, setPlan] = useState<1 | 2>(2)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [gov, setGov] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const total = plan === 2 ? PRICE_TWO : PRICE_ONE

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !/^\d{8}$/.test(phone.replace(/\s/g, "")) || !gov || !address.trim()) {
      setError("عمّر كل الخانات ورقم هاتف من 8 أرقام.")
      return
    }
    setError("")
    const msg = "طلب جديد: أكوتس " + flavor.name + "\nالكمية: " + plan + " علبة\nالمجموع: " + total + " د.ت (الدفع عند الاستلام)\nالاسم: " + name + "\nالهاتف: " + phone + "\nالولاية: " + gov + "\nالعنوان: " + address
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank")
  }

  const field = "w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base outline-none transition focus:border-primary"
  const planCls = (on: boolean) => "relative flex-1 rounded-2xl border-2 p-4 text-start transition " + (on ? "border-primary bg-card shadow-md" : "border-border bg-card/60 hover:border-primary/50")

  return (
    <aside id="order" className="rounded-[2rem] border-2 border-primary/20 bg-card p-6 md:p-8 shadow-lg lg:sticky lg:top-24">
      <p className="text-sm font-bold text-primary">ALLMAX · أكوتس</p>
      <h1 className="mt-1 text-4xl md:text-5xl leading-[1.05]">طاقة بنكهة {flavor.name}، من غير سكر.</h1>
      <p className="mt-3 text-muted-foreground">مسحوق أحماض أمينية للنشاط والتركيز في التمرين. علبة بنكهة {flavor.name}، تتخلط في الماء ويتشرب باردًا.</p>

      <p className="mt-6 text-sm font-bold">النكهة: {flavor.name}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FLAVORS.map((f) => (
          <button key={f.id} type="button" onClick={() => selectFlavor(f.id)} style={{ background: f.bg }} className={"rounded-full border-2 px-4 py-1.5 text-sm font-black text-foreground transition hover:-translate-y-0.5 " + (f.id === flavor.id ? "border-foreground" : "border-transparent")}>{f.name}</button>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={() => setPlan(1)} className={planCls(plan === 1)}>
          <span className="block text-sm text-muted-foreground">علبة وحدة</span>
          <span className="block text-2xl font-black">{PRICE_ONE} <span className="text-base">د.ت</span></span>
        </button>
        <button type="button" onClick={() => setPlan(2)} className={planCls(plan === 2)}>
          <span className="absolute -top-3 end-3 rounded-full bg-accent px-3 py-0.5 text-xs font-black text-accent-foreground">الأوفر</span>
          <span className="block text-sm text-muted-foreground">علبتين</span>
          <span className="block text-2xl font-black">{PRICE_TWO} <span className="text-base">د.ت</span></span>
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input className={field} placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={field} placeholder="رقم الهاتف (8 أرقام)" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select className={field} value={gov} onChange={(e) => setGov(e.target.value)}>
          <option value="">اختار الولاية</option>
          {GOVS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input className={field} placeholder="العنوان بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} />
        {error && <p className="text-sm font-bold text-destructive">{error}</p>}
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-lg font-black text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
          اطلب الآن — {total} د.ت
        </button>
      </form>

      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li className="flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" />الدفع عند الاستلام</li>
        <li className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" />توصيل لكامل ولايات تونس</li>
        <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Verified for Sport — مواد محظورة مفحوصة</li>
      </ul>
    </aside>
  )
}

export const _unused = [Check, Minus, Plus]
