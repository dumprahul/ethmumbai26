"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, MapPin, Users } from "lucide-react"
import { DUMMY_EVENTS, type ViewEvent } from "@/lib/dummy-events"

function EventCard({ event }: { event: ViewEvent }) {
  return (
    <article className="border border-foreground bg-background flex flex-col">
      {/* Card header: ID + status pill */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground">
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-medium text-foreground">
          {event.id}
        </span>
        <span
          className={`text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 ${
            event.status === "ACTIVE"
              ? "bg-[#ea580c] text-white"
              : "bg-muted-foreground/30 text-white"
          }`}
        >
          {event.status}
        </span>
      </div>

      {/* Card main content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h2 className="text-base font-mono font-bold tracking-tight uppercase text-foreground leading-tight">
          {event.title}
        </h2>
        <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0" />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={12} className="shrink-0" />
            {event.dateTime}
          </span>
          <span className="flex items-center gap-2">
            <Users size={12} className="shrink-0" />
            {event.attendees} / {event.capacity} attendees
            {event.ageRestriction && (
              <span className="text-foreground font-medium ml-1">
                · {event.ageRestriction}
              </span>
            )}
          </span>
        </div>
        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-mono mt-1">
          ORGANIZER: {event.organizer}
        </p>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3 border-t border-foreground">
        <Link
          href={`/view/${event.id}`}
          className="text-xs font-mono tracking-widest uppercase text-[#ea580c] hover:underline inline-flex items-center gap-1"
        >
          VIEW DETAILS →
        </Link>
      </div>
    </article>
  )
}

export default function ViewPage() {
  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 lg:py-12">
        {/* Header: Back + VIEW_EVENTS */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← BACK
          </Link>
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"// VIEW_EVENTS"}
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Title row: ALL EVENTS + CREATE EVENT button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-2xl lg:text-4xl font-mono font-bold tracking-tight uppercase text-foreground">
            ALL EVENTS
          </h1>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-foreground text-background px-5 py-2.5 text-xs font-mono tracking-widest uppercase shrink-0"
          >
            CREATE EVENT
          </Link>
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
