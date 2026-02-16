"use client"

import useSWR from "swr"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { RankingsTable } from "@/components/rankings-table"
import { MatchResults } from "@/components/match-results"
import { TournamentsGrid } from "@/components/tournaments-grid"
import { HeroStats } from "@/components/hero-stats"
import type { GosuGamersData } from "@/lib/types"
import { Loader2, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR<GosuGamersData>(
    "/api/gosugamers",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 5 * 60 * 1000,
    }
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        lastUpdated={data?.lastUpdated || null}
        isLoading={isLoading}
        isError={!!error}
        onRefresh={() => mutate()}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {isLoading && !data && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Scraping GosuGamers data...
            </p>
          </div>
        )}

        {error && !data && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              Failed to fetch data. Please try again.
            </p>
            <button
              onClick={() => mutate()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Data source:
              </span>
              <a
                href={`https://${data.source}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent underline-offset-2 hover:underline"
              >
                {data.source}
              </a>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                Auto-Scraped
              </span>
            </div>

            <StatsOverview data={data} />

            {/* Mobile: tabbed layout */}
            <div className="lg:hidden">
              <Tabs defaultValue="rankings">
                <TabsList className="grid w-full grid-cols-4 bg-secondary">
                  <TabsTrigger
                    value="rankings"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Rankings
                  </TabsTrigger>
                  <TabsTrigger
                    value="matches"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Matches
                  </TabsTrigger>
                  <TabsTrigger
                    value="heroes"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Heroes
                  </TabsTrigger>
                  <TabsTrigger
                    value="tournaments"
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Tourneys
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="rankings" className="mt-4">
                  <RankingsTable teams={data.rankings} />
                </TabsContent>
                <TabsContent value="matches" className="mt-4">
                  <MatchResults matches={data.matches} />
                </TabsContent>
                <TabsContent value="heroes" className="mt-4">
                  <HeroStats heroStats={data.heroStats} />
                </TabsContent>
                <TabsContent value="tournaments" className="mt-4">
                  <TournamentsGrid tournaments={data.tournaments} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop: side-by-side layout */}
            <div className="hidden gap-6 lg:grid lg:grid-cols-5">
              <div className="lg:col-span-3">
                <RankingsTable teams={data.rankings} />
              </div>
              <div className="flex flex-col gap-6 lg:col-span-2">
                <MatchResults matches={data.matches} />
                <TournamentsGrid tournaments={data.tournaments} />
              </div>
            </div>

            {/* Hero Stats - full width */}
            <div className="hidden lg:block">
              <HeroStats heroStats={data.heroStats} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            MLBB AutoClaw scrapes publicly available data from GosuGamers.net and Liquipedia.net.
            Hero statistics are real data from the M7 World Championship. Not affiliated with GosuGamers, Liquipedia, or Moonton.
          </p>
        </div>
      </footer>
    </div>
  )
}
