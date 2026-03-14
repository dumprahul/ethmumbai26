import Link from "next/link"

export default function CreateEventPage() {
  return (
    <main className="min-h-screen px-4 md:px-16 py-10 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Create Event</p>
            <h1 className="font-[var(--font-bebas)] text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Set up your Disco event
            </h1>
          </div>
          <p className="font-mono text-xs md:text-sm text-muted-foreground max-w-md">
            Quick Luma-style setup. Just fill basics and pick requirements — the ZK magic and wallets come later.
          </p>
        </header>

        <section className="grid gap-6 md:gap-8 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)]">
          {/* Form skeleton */}
          <div className="space-y-5 border border-border/40 bg-card/70 p-5 md:p-7">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Event name
              </label>
              <input
                disabled
                placeholder="After Hours Mixer Event"
                className="w-full bg-background/40 border border-border/60 px-3 py-2.5 text-[13px] font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Description
              </label>
              <textarea
                disabled
                rows={2}
                placeholder="Short blurb your guests will see for this event."
                className="w-full bg-background/40 border border-border/60 px-3 py-2.5 text-[13px] font-mono text-foreground placeholder:text-muted-foreground/60 outline-none resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Date
                </label>
                <input
                  disabled
                  placeholder="2026-03-15"
                  className="w-full bg-background/40 border border-border/60 px-3 py-2.5 text-[13px] font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Location
                </label>
                <input
                  disabled
                  placeholder="Mumbai — Secret rooftop"
                  className="w-full bg-background/40 border border-border/60 px-3 py-2.5 text-[13px] font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Requirements</p>
              <div className="space-y-3">
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground">Age proof (ZK)</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">Guest proves age ≥ 21.</p>
                </div>
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground">Membership check</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">Member of your allowlist / DAO.</p>
                </div>
                <div className="border border-border/60 bg-background/40 px-4 py-3">
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground">Wallet isolation</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Tickets live in a BitGo event wallet, not their main one.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
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
          <aside className="space-y-4 border border-border/40 bg-card/60 p-5 md:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Snapshot</p>
            <ul className="space-y-2 font-mono text-[11px] text-muted-foreground leading-relaxed">
              <li>• You set name, time, place, and simple rules.</li>
              <li>• Guests will later prove they match those rules with ZK.</li>
              <li>• Tickets stay in a separate, BitGo-backed event wallet.</li>
            </ul>

            <p className="pt-2 font-mono text-[10px] text-muted-foreground">
              This is a visual prototype only — no data is saved yet.
            </p>
          </aside>
        </section>
      </div>
    </main>
  )
}

