import { HeroSection } from "@/main/components/hero-section"
import { SignalsSection } from "@/main/components/signals-section"
import { WorkSection } from "@/main/components/work-section"
import { PrinciplesSection } from "@/main/components/principles-section"
import { ColophonSection } from "@/main/components/colophon-section"
import { SideNav } from "@/main/components/side-nav"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <ColophonSection />
      </div>
    </main>
  )
}
