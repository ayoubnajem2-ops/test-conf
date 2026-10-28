import "../theme.css"
import { PRICE_TWO } from "@/components/store/BuyRail"
import { Ticker, Gallery, Why, Flavors, Faq } from "@/components/store/Sections"
import { Announcement, TopBar, Hero } from "@/components/store/Top"
import VoiceCall from "@/components/store/VoiceCall"
import { PromoBanner, PackStack, BigHeadline, OrderSection } from "@/components/store/Bands"

const Index = () => {
  const goOrder = () => document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "center" })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Announcement />
      <TopBar onOrder={goOrder} />
      <main>
        <Hero onOrder={goOrder} />
        <Ticker />
        <PromoBanner onOrder={goOrder} />
        <PackStack />
        <BigHeadline onOrder={goOrder} />
        <Why />
        <Gallery />
        <Flavors />
        <OrderSection />
        <Faq />
      </main>

      <footer className="bg-foreground px-5 pb-24 pt-10 text-background lg:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="font-heavy text-3xl">زيست</span>
          <p className="text-sm opacity-80">إعلان: هذه الصفحة متجر إعلاني لبيع أكوتس (ALLMAX) في تونس — الدفع عند الاستلام. © 2026</p>
        </div>
      </footer>

      <VoiceCall />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <button onClick={goOrder} className="w-full rounded-full bg-primary py-3 text-lg font-black text-primary-foreground">اطلب الآن — {PRICE_TWO} د.ت لعلبتين</button>
      </div>
    </div>
  )
}

export default Index
