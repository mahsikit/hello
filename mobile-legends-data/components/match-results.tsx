"use client"

import { useState } from "react"
import { Swords, Filter, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchDetail } from "@/components/match-detail"
import type { MatchResult } from "@/lib/types"

function MatchCard({
  match,
  onClick,
}: {
  match: MatchResult
  onClick: () => void
}) {
  const team1Won = match.score1 > match.score2
  const team2Won = match.score2 > match.score1
  const hasDraft = match.games && match.games.length > 0

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary/30"
      aria-label={`${match.team1} ${match.score1} - ${match.score2} ${match.team2}. Click to view draft details.`}
    >
      <div className="flex flex-1 items-center justify-end gap-2">
        <span
          className={`text-sm font-medium ${
            team1Won ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {match.team1}
        </span>
        {team1Won && (
          <span className="h-1.5 w-1.5 rounded-full bg-chart-3" />
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1">
        <span
          className={`font-mono text-sm font-bold ${
            team1Won ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {match.score1}
        </span>
        <span className="text-xs text-muted-foreground">:</span>
        <span
          className={`font-mono text-sm font-bold ${
            team2Won ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {match.score2}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-2">
        {team2Won && (
          <span className="h-1.5 w-1.5 rounded-full bg-chart-3" />
        )}
        <span
          className={`text-sm font-medium ${
            team2Won ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {match.team2}
        </span>
      </div>

      {hasDraft && (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
}

export function MatchResults({ matches }: { matches: MatchResult[] }) {
  const tournaments = [...new Set(matches.map((m) => m.tournament))]
  const [selectedTournament, setSelectedTournament] = useState<string>("all")
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)

  const filteredMatches =
    selectedTournament === "all"
      ? matches
      : matches.filter((m) => m.tournament === selectedTournament)

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold text-card-foreground">
                Match Results
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              {filteredMatches.length} matches
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Click a match to view hero picks and bans
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <button
              onClick={() => setSelectedTournament("all")}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedTournament === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              All
            </button>
            {tournaments.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTournament(t)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  selectedTournament === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {t.length > 25 ? t.slice(0, 25) + "..." : t}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredMatches.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No matches found for this tournament.
            </p>
          ) : (
            <div>
              {filteredMatches.map((match, i) => (
                <div key={`${match.team1}-${match.team2}-${i}`}>
                  {i === 0 ||
                  (match.tournament !== filteredMatches[i - 1]?.tournament &&
                    selectedTournament === "all") ? (
                    <div className="border-b border-border bg-secondary/50 px-4 py-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {match.tournament}
                      </span>
                    </div>
                  ) : null}
                  <MatchCard
                    match={match}
                    onClick={() => setSelectedMatch(match)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMatch && (
        <MatchDetail
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  )
}
