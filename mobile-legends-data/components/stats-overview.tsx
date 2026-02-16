"use client"

import { Trophy, Swords, Calendar, Shield } from "lucide-react"
import type { GosuGamersData } from "@/lib/types"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext: string
}

function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{subtext}</p>
      </div>
    </div>
  )
}

export function StatsOverview({ data }: { data: GosuGamersData }) {
  const regions = [...new Set(data.rankings.map((t) => t.region))]
  const ongoingTournaments = data.tournaments.filter((t) => t.status === "ongoing")

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={<Trophy className="h-5 w-5 text-primary" />}
        label="Top Team"
        value={data.rankings[0]?.name || "N/A"}
        subtext={`ELO ${data.rankings[0]?.elo || 0}`}
      />
      <StatCard
        icon={<Swords className="h-5 w-5 text-accent" />}
        label="Recent Matches"
        value={data.matches.length}
        subtext="From GosuGamers"
      />
      <StatCard
        icon={<Calendar className="h-5 w-5 text-chart-3" />}
        label="Active Tournaments"
        value={ongoingTournaments.length}
        subtext={`${data.tournaments.length} total events`}
      />
      <StatCard
        icon={<Shield className="h-5 w-5 text-chart-1" />}
        label="Heroes Tracked"
        value={data.heroStats.length}
        subtext="M7 Liquipedia data"
      />
    </div>
  )
}
