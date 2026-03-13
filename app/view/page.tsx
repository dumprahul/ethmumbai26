import Link from "next/link"

const events = [
  {
    name: "After Hours Mixer Event",
    date: "2026.03.15",
    location: "Mumbai — Private rooftop",
    requirements: ["Age ≥ 21 (ZK proof)", "Member of curated community list", "Isolated BitGo event wallet"],
    tag: "Featured",
  },
  {
    name: "Zero-Knowledge Builders Lounge",
    date: "2026.03.16",
    location: "Online — Token-gated",
    requirements: ["Contributor to a zk project", "Proof-of-contribution without GitHub handle"],
    tag: "Online",
  },
  {
    name: "Base Night Sessions",
    date: "2026.03.17",
    location: "Mumbai — Warehouse",
    requirements: ["On-chain activity on Base", "No full wallet history revealed"],
    tag: "On Base",
  },
  {
    name: "Stealth Founder Roundtable",
    date: "2026.03.18",
    location: "Undisclosed",
    requirements: ["Founder proof (ZK)", "No email list, no LinkedIn scraping"],
    tag: "Private",
  },
]

export default function ViewEventsPage() {
  return (
    <main className="min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">View Events</p>
          <h1 className="font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">Explore Disco events</h1>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl">
            Luma-style overview of upcoming events where eligibility is enforced with zero-knowledge proofs and
            privacy-preserving wallets, not CSV exports of your guests.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/create"
              className="inline-flex items-center justify-center border border-border/80 bg-foreground text-background px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-accent hover:border-accent transition-colors"
            >
              Create event
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-border/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent hover:border-accent transition-colors"
            >
              Back to overview
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {events.map((event, index) => (
            <article
              key={event.name}
              className="relative border border-border/50 bg-card/70 p-6 md:p-7 flex flex-col justify-between overflow-hidden"
            >
              {event.tag && (
                <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                  {event.tag}
                </span>
              )}

              <div className="space-y-3 pr-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {`Event ${String(index + 1).padStart(2, "0")}`}
                </p>
                <h2 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight text-foreground">
                  {event.name}
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {event.date} — {event.location}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Requirements
                </p>
                <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {event.requirements.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button
                  disabled
                  className="inline-flex items-center justify-center border border-border/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground cursor-not-allowed opacity-70"
                >
                  RSVP with proof — soon
                </button>
                <p className="font-mono text-[9px] text-muted-foreground text-right max-w-[140px]">
                  ZK proofs verified on Base. Wallets managed by BitGo.
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

