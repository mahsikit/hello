"use client"

import { X, Trophy, Ban, Shield, ExternalLink } from "lucide-react"
import type { MatchResult, GameDraft } from "@/lib/types"
import { getHeroRole, ROLE_COLORS, type HeroRole } from "@/lib/mlbb-heroes"

function HeroBadge({ hero, type }: { hero: string; type: "pick" | "ban" }) {
  const role = getHeroRole(hero)
  const color = ROLE_COLORS[role]

  if (type === "ban") {
    return (
      <div className="flex items-center gap-1.5 rounded border border-destructive/30 bg-destructive/10 px-2 py-1">
        <Ban className="h-3 w-3 text-destructive" />
        <span className="text-xs font-medium text-destructive line-through">
          {hero}
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded border px-2 py-1"
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium text-foreground">{hero}</span>
      <span
        className="text-[10px] uppercase"
        style={{ color }}
      >
        {role.slice(0, 3)}
      </span>
    </div>
  )
}

function GameCard({
  game,
  team1Name,
  team2Name,
}: {
  game: GameDraft
  team1Name: string
  team2Name: string
}) {
  const winnerName = game.winner === "team1" ? team1Name : team2Name

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-sm font-semibold text-foreground">
          Game {game.game}
        </span>
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{winnerName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {/* Team 1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${
                game.winner === "team1" ? "text-primary" : "text-foreground"
              }`}
            >
              {team1Name}
            </span>
            {game.winner === "team1" && (
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                WIN
              </span>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Shield className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Picks
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {game.team1Picks.map((hero) => (
                <HeroBadge key={hero} hero={hero} type="pick" />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Ban className="h-3 w-3 text-destructive" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Bans
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {game.team1Bans.map((hero) => (
                <HeroBadge key={hero} hero={hero} type="ban" />
              ))}
            </div>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold ${
                game.winner === "team2" ? "text-primary" : "text-foreground"
              }`}
            >
              {team2Name}
            </span>
            {game.winner === "team2" && (
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                WIN
              </span>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Shield className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Picks
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {game.team2Picks.map((hero) => (
                <HeroBadge key={hero} hero={hero} type="pick" />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Ban className="h-3 w-3 text-destructive" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Bans
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {game.team2Bans.map((hero) => (
                <HeroBadge key={hero} hero={hero} type="ban" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MatchDetail({
  match,
  onClose,
}: {
  match: MatchResult
  onClose: () => void
}) {
  const team1Won = match.score1 > match.score2

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 pt-12 backdrop-blur-sm md:pt-20"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Match detail: ${match.team1} vs ${match.team2}`}
    >
      <div className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {match.tournament}
            </span>
            <span className="text-xs text-muted-foreground">{match.date}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close match detail"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Score */}
        <div className="flex items-center justify-center gap-6 border-b border-border px-6 py-6">
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-lg font-bold ${
                team1Won ? "text-primary" : "text-foreground"
              }`}
            >
              {match.team1}
            </span>
            {team1Won && (
              <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                WINNER
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary px-5 py-3">
            <span className="font-mono text-2xl font-bold text-foreground">
              {match.score1}
            </span>
            <span className="text-lg text-muted-foreground">-</span>
            <span className="font-mono text-2xl font-bold text-foreground">
              {match.score2}
            </span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span
              className={`text-lg font-bold ${
                !team1Won ? "text-primary" : "text-foreground"
              }`}
            >
              {match.team2}
            </span>
            {!team1Won && (
              <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                WINNER
              </span>
            )}
          </div>
        </div>

        {/* External Links */}
        {(match.gosuGamersUrl || match.liquipediaUrl) && (
          <div className="flex items-center justify-center gap-3 border-b border-border px-6 py-4">
            {match.gosuGamersUrl && (
              <a
                href={match.gosuGamersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                View on GosuGamers
              </a>
            )}
            {match.liquipediaUrl && (
              <a
                href={match.liquipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                View on Liquipedia
              </a>
            )}
          </div>
        )}

        {/* Games with drafts */}
        <div className="flex flex-col gap-4 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Draft Breakdown
          </h3>
          {match.games && match.games.length > 0 ? (
            match.games.map((game) => (
              <GameCard
                key={game.game}
                game={game}
                team1Name={match.team1}
                team2Name={match.team2}
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Draft data not available for this match.
            </p>
          )}
        </div>

        {/* Role legend */}
        <div className="border-t border-border px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Roles:
            </span>
            {(Object.entries(ROLE_COLORS) as [HeroRole, string][]).map(
              ([role, color]) => (
                <div key={role} className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] capitalize text-muted-foreground">
                    {role}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
