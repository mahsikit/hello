"use client"

import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Tournament } from "@/lib/types"

const statusStyles: Record<string, string> = {
  ongoing: "bg-chart-3/20 text-chart-3",
  upcoming: "bg-accent/20 text-accent",
  past: "bg-muted text-muted-foreground",
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {tournament.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            statusStyles[tournament.status] || statusStyles.past
          }`}
        >
          {tournament.status}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <DollarSign className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-foreground">{tournament.prizePool}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {new Date(tournament.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {new Date(tournament.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{tournament.teams} teams</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{tournament.region}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TournamentsGrid({ tournaments }: { tournaments: Tournament[] }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Tournaments
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {tournaments.length} events
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {tournaments.map((t) => (
            <TournamentCard key={t.name} tournament={t} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
