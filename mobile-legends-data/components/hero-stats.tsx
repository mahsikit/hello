"use client"

import { useState, useMemo } from "react"
import { BarChart3, ArrowUpDown, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLE_COLORS, type HeroRole, type HeroStatEntry } from "@/lib/mlbb-heroes"

type SortKey = "presenceRate" | "picks" | "bans" | "winRate"

export function HeroStats({ heroStats }: { heroStats: HeroStatEntry[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("presenceRate")
  const [roleFilter, setRoleFilter] = useState<HeroRole | "all">("all")

  const filtered = useMemo(() => {
    let list = [...heroStats]
    if (roleFilter !== "all") {
      list = list.filter((h) => h.role === roleFilter)
    }
    list.sort((a, b) => b[sortKey] - a[sortKey])
    return list
  }, [heroStats, sortKey, roleFilter])

  const roles: (HeroRole | "all")[] = ["all", "tank", "fighter", "assassin", "mage", "marksman", "support"]

  // Summary stats
  const topPicked = heroStats.length > 0 ? [...heroStats].sort((a, b) => b.picks - a.picks)[0] : null
  const topBanned = heroStats.length > 0 ? [...heroStats].sort((a, b) => b.bans - a.bans)[0] : null
  const topWinRate = heroStats.length > 0
    ? [...heroStats].filter(h => h.picks >= 10).sort((a, b) => b.winRate - a.winRate)[0]
    : null

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold text-card-foreground">
              M7 Hero Statistics
            </CardTitle>
            <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              REAL DATA
            </span>
          </div>
          <a
            href="https://liquipedia.net/mobilelegends/M7_World_Championship/Statistics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            Liquipedia
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          116 total games played across Wildcard, Swiss Stage, and Knockout Stage
        </p>

        {/* Quick summary */}
        {topPicked && topBanned && topWinRate && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-md bg-secondary px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Most Picked</span>
              <p className="text-sm font-bold text-foreground">{topPicked.name}</p>
              <p className="text-[11px] text-muted-foreground">{topPicked.picks} picks</p>
            </div>
            <div className="rounded-md bg-secondary px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Most Banned</span>
              <p className="text-sm font-bold text-destructive">{topBanned.name}</p>
              <p className="text-[11px] text-muted-foreground">{topBanned.bans} bans</p>
            </div>
            <div className="rounded-md bg-secondary px-3 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{"Best WR (10+)"}</span>
              <p className="text-sm font-bold text-chart-3">{topWinRate.name}</p>
              <p className="text-[11px] text-muted-foreground">{topWinRate.winRate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Role filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Sort buttons */}
        <div className="flex items-center gap-1 border-b border-border px-4 py-2">
          <ArrowUpDown className="mr-1 h-3 w-3 text-muted-foreground" />
          {([
            { key: "presenceRate" as SortKey, label: "Presence" },
            { key: "picks" as SortKey, label: "Picks" },
            { key: "bans" as SortKey, label: "Bans" },
            { key: "winRate" as SortKey, label: "Win %" },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                sortKey === key
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 border-b border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Hero</span>
          <span className="w-14 text-center">Pick</span>
          <span className="w-14 text-center">Ban</span>
          <span className="w-14 text-center">Win %</span>
          <span className="w-20 text-center">Presence</span>
        </div>

        {/* Rows */}
        <div className="max-h-[560px] overflow-y-auto">
          {filtered.map((hero, i) => (
            <div
              key={hero.name}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 border-b border-border/50 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-secondary/30"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-right font-mono text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[hero.role] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {hero.name}
                </span>
                <span
                  className="text-[10px] uppercase"
                  style={{ color: ROLE_COLORS[hero.role] }}
                >
                  {hero.role.slice(0, 3)}
                </span>
              </div>
              <div className="flex w-14 flex-col items-center">
                <span className="font-mono text-sm text-foreground">
                  {hero.picks}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {hero.pickRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex w-14 flex-col items-center">
                <span className="font-mono text-sm text-destructive">
                  {hero.bans}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {hero.banRate.toFixed(1)}%
                </span>
              </div>
              <span
                className={`w-14 text-center font-mono text-sm font-medium ${
                  hero.winRate >= 60
                    ? "text-chart-3"
                    : hero.winRate <= 40
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {hero.winRate.toFixed(1)}%
              </span>
              <div className="flex w-20 items-center gap-1.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(hero.presenceRate, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {hero.presenceRate.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5">
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
      </CardContent>
    </Card>
  )
}
