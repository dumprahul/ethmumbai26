import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BitgoEventRequirements } from "@/components/bitgo-event-requirements"
import { getEventById } from "@/lib/dummy-events"
import { Calendar, MapPin, User, Circle } from "lucide-react"

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = getEventById(id)
  if (!event) notFound()

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 lg:py-12">
        {/* Back link */}
        <Link
          href="/view"
          className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← ALL EVENTS
        </Link>

        {/* Event header box */}
        <div className="border-2 border-foreground bg-background mb-6">
          <div className="flex items-center justify-between px-5 py-3 border-b border-foreground bg-muted/50">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
              {event.id}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] tracking-widest uppercase font-mono px-2 py-1 ${
                  event.status === "ACTIVE"
                    ? "bg-[#ea580c] text-white"
                    : "bg-muted-foreground/30 text-white"
                }`}
              >
                {event.status}
              </span>
              {event.ageRestriction && (
                <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-1 border-2 border-foreground bg-background">
                  {event.ageRestriction} ONLY
                </span>
              )}
            </div>
          </div>
          <div className="px-5 py-8">
            <h1 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-foreground mb-2">
              {event.title}
            </h1>
            <p className="text-sm font-mono text-muted-foreground">
              {event.organizerDisplay}
            </p>
          </div>
        </div>

        {/* 2x2 detail grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                LOCATION
              </span>
            </div>
            <p className="text-sm font-mono font-medium text-foreground">
              {event.location}
            </p>
          </div>

          {/* Date & time */}
          <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                DATE & TIME
              </span>
            </div>
            <p className="text-sm font-mono font-medium text-foreground">
              {event.longDateTime}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {event.dateTime}
            </p>
          </div>

          {/* Organizer */}
          <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <User size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                ORGANIZER
              </span>
            </div>
            <p className="text-sm font-mono font-medium text-foreground">
              {event.organizerDisplay}
            </p>
          </div>

          {/* Age requirement */}
          <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Circle size={14} className="shrink-0 text-muted-foreground" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                AGE REQUIREMENT
              </span>
            </div>
            <p className="text-sm font-mono font-medium text-foreground">
              {event.ageRestriction ? `${event.ageRestriction} only` : "None"}
            </p>
          </div>
        </div>

        {/* Bitgo After Hours Party: ZK Twitter + ZK age (EVT_001 = BitGo, EVT_012 = EVM wallet) */}
        {(event.id === "EVT_001" || event.id === "EVT_012") && (
          <BitgoEventRequirements useEvmWallet={event.id === "EVT_012"} />
        )}
      </main>
      <Footer />
    </div>
  )
}
