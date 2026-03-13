import Link from "next/link"

export default function CreateEventPage() {
  return (
    <main className="min-h-screen px-6 md:px-24 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Create Event</p>
          <h1 className="font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">Set up a Disco event</h1>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl">
            Define what guests need to prove to attend. Disco will later turn these requirements into zero-knowledge
            proofs, BitGo wallets, and Base ticket logic — without exposing attendee identities.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Form skeleton */}
          <div className="space-y-6 border border-border/40 bg-card/60 p-6 md:p-8">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Event name
              </label>
              <input
                disabled
                placeholder="After Hours Mixer Event"
                className="w-full bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Description
              </label>
              <textarea
                disabled
                rows={3}
                placeholder="A private, invite-only mixer where guests prove they meet the criteria without sharing personal data."
                className="w-full bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Date
                </label>
                <input
                  disabled
                  placeholder="2026-03-15"
                  className="w-full bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Location
                </label>
                <input
                  disabled
                  placeholder="Mumbai — Secret rooftop"
                  className="w-full bg-background/40 border border-border/60 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Requirements</p>
              <div className="space-y-3">
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
                    Age proof (ZK)
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Guest must prove age ≥ 21 without revealing exact birth date.
                  </p>
                </div>
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
                    Membership check
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Guest must prove membership in a DAO / community list without revealing their handle.
                  </p>
                </div>
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
                    Wallet isolation
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Each attendee gets a BitGo-powered event wallet so their main on-chain history stays private.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                disabled
                className="inline-flex items-center justify-center border border-border/80 bg-foreground text-background px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] cursor-not-allowed opacity-60"
              >
                Continue — coming soon
              </button>
              <Link
                href="/view"
                className="inline-flex items-center justify-center border border-border/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent hover:border-accent transition-colors"
              >
                View sample events
              </Link>
            </div>
          </div>

          {/* Requirements explainer */}
          <aside className="space-y-4 border border-border/40 bg-card/40 p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">What you define</p>
            <ul className="space-y-3 font-mono text-[11px] text-muted-foreground leading-relaxed">
              <li>
                <span className="text-foreground">• Eligibility rules</span> — age thresholds, membership lists,
                on-chain conditions.
              </li>
              <li>
                <span className="text-foreground">• Event details</span> — name, time, location, capacity.
              </li>
              <li>
                <span className="text-foreground">• Ticket style</span> — single-use entry passes, allowlist spots, or
                collectibles.
              </li>
            </ul>

            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground pt-4">
              What Disco handles
            </p>
            <ul className="space-y-3 font-mono text-[11px] text-muted-foreground leading-relaxed">
              <li>• Zero-knowledge proofs generated locally on the user&apos;s device.</li>
              <li>• BitGo wallet creation and secure key management per attendee.</li>
              <li>• Ticket and verification contracts deployed on Base.</li>
            </ul>

            <p className="pt-4 font-mono text-[10px] text-muted-foreground">
              This page is a frontend prototype — wiring the actual ZK flows, BitGo APIs, and Base contracts will come
              next.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}

