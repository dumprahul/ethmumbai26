import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

const FeatureGrid = dynamic(() => import("@/components/feature-grid").then((m) => ({ default: m.FeatureGrid })), {
  ssr: false,
  loading: () => <section className="w-full px-6 py-20 lg:px-12 min-h-[400px]" aria-hidden />,
})
const AboutSection = dynamic(() => import("@/components/about-section").then((m) => ({ default: m.AboutSection })), {
  ssr: false,
  loading: () => <section className="w-full min-h-[200px]" aria-hidden />,
})
const PricingSection = dynamic(() => import("@/components/pricing-section").then((m) => ({ default: m.PricingSection })), {
  ssr: false,
  loading: () => <section className="w-full min-h-[200px]" aria-hidden />,
})
const GlitchMarquee = dynamic(() => import("@/components/glitch-marquee").then((m) => ({ default: m.GlitchMarquee })), {
  ssr: false,
  loading: () => <section className="w-full py-16 min-h-[120px]" aria-hidden />,
})

export default function Page() {
  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <AboutSection />
        <PricingSection />
        <GlitchMarquee />
      </main>
      <Footer />
    </div>
  )
}
