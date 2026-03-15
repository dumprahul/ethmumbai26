"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { addEvent } from "@/lib/events"
import { ArrowRight } from "lucide-react"

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [venue, setVenue] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")
  const [ageVerificationEnabled, setAgeVerificationEnabled] = useState(false)
  const [minimumAge, setMinimumAge] = useState("21")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEvent({
      name: name.trim() || "Untitled Event",
      description: description.trim() || "",
      date: date.trim() || "",
      venue: venue.trim() || "",
      maxAttendees: maxAttendees.trim() || "",
      ageVerificationEnabled,
      minimumAge: ageVerificationEnabled ? minimumAge.trim() || "21" : "",
      category: category.trim() || "",
    })
    setSubmitted(true)
    setName("")
    setDescription("")
    setDate("")
    setVenue("")
    setMaxAttendees("")
    setAgeVerificationEnabled(false)
    setMinimumAge("21")
    setCategory("")
  }

  return (
    <div className="min-h-screen dot-grid-bg flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"// REGISTER_EVENT"}
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        {submitted ? (
          <div className="border-2 border-foreground bg-background p-8 text-center">
            <p className="text-sm font-mono text-foreground mb-4">
              Event registered. It will appear on the view page.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/view">
                <Button className="font-mono tracking-widest uppercase border-2 border-foreground rounded-none">
                  View events
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="font-mono tracking-widest uppercase border-2 border-foreground rounded-none"
                onClick={() => setSubmitted(false)}
              >
                Register another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="name" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Event name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ETH Mumbai Afterparty"
                className="font-mono border-2 border-foreground rounded-none"
              />
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="description" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Event description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                rows={4}
                className="font-mono border-2 border-foreground rounded-none resize-none"
              />
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="date" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Event date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono border-2 border-foreground rounded-none"
              />
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="venue" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Venue / location
              </Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="font-mono border-2 border-foreground rounded-none"
              />
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="maxAttendees" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Max attendees
              </Label>
              <Input
                id="maxAttendees"
                type="number"
                min="1"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="e.g. 100"
                className="font-mono border-2 border-foreground rounded-none"
              />
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  Age verification
                </Label>
                <Switch
                  checked={ageVerificationEnabled}
                  onCheckedChange={setAgeVerificationEnabled}
                  className="border-2 border-foreground data-[state=checked]:bg-[#ea580c]"
                />
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                When enabled, attendees must prove they meet the minimum age via ZK proof.
              </p>
              {ageVerificationEnabled && (
                <div className="flex flex-col gap-2 pt-2">
                  <Label htmlFor="minimumAge" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                    Minimum age
                  </Label>
                  <Input
                    id="minimumAge"
                    type="number"
                    min="18"
                    max="120"
                    value={minimumAge}
                    onChange={(e) => setMinimumAge(e.target.value)}
                    className="font-mono border-2 border-foreground rounded-none w-24"
                  />
                </div>
              )}
            </div>

            <div className="border-2 border-foreground p-6 flex flex-col gap-4">
              <Label htmlFor="category" className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Conference, Meetup, Workshop"
                className="font-mono border-2 border-foreground rounded-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Button
                type="submit"
                className="font-mono tracking-widest uppercase border-2 border-foreground rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                <span className="flex items-center justify-center w-10 h-10 bg-[#ea580c]">
                  <ArrowRight size={16} strokeWidth={2} className="text-background" />
                </span>
                <span className="px-4">Register event</span>
              </Button>
              <Link href="/view" className="sm:ml-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto font-mono tracking-widest uppercase border-2 border-foreground rounded-none"
                >
                  View events
                </Button>
              </Link>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
