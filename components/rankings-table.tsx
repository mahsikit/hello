"use client"

import { useState } from "react"
import { Trophy, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Team } from "@/lib/types"

const regionColors: Record<string, string> = {
  Philippines: "bg-blue-500/20 text-blue-300",
  Indonesia: "bg-red-500/20 text-red-300",
  Malaysia: "bg-yellow-500/20 text-yellow-300",
  "Saudi Arabia": "bg-green-500/20 text-green-300",
  Russia: "bg-sky-500/20 text-sky-300",
  Cambodia: "bg-orange-500/20 text-orange-300",
  Global: "bg-muted text-muted-foreground",
}

export function RankingsTable({ teams }: { teams: Team[] }) {
  const [showAll, setShowAll] = useState(false)
  const displayTeams = showAll ? teams : teams.slice(0, 10)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold text-card-foreground">
            Team Rankings
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {teams.length} teams
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Team
                </th>
                <th className="hidden px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Region
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ELO
                </th>
                <th className="hidden px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                  Win Rate
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody>
              {displayTeams.map((team) => (
                <tr
                  key={team.rank}
                  className="border-t border-border transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                        team.rank <= 3
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {team.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {team.name}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        regionColors[team.region] || regionColors.Global
                      }`}
                    >
                      {team.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-card-foreground">
                    {team.elo}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground md:table-cell">
                    {team.winRate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        team.streak.startsWith("W")
                          ? "text-chart-3"
                          : "text-destructive"
                      }`}
                    >
                      {team.streak.startsWith("W") ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {team.streak}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teams.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex w-full items-center justify-center gap-1 border-t border-border py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/30 hover:text-foreground"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show All {teams.length} Teams <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
