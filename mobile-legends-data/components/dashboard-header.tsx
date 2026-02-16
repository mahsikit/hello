"use client"

import { RefreshCw, Database, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  lastUpdated: string | null
  isLoading: boolean
  isError: boolean
  onRefresh: () => void
}

export function DashboardHeader({ lastUpdated, isLoading, isError, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              MLBB AutoClaw
            </h1>
            <p className="text-xs text-muted-foreground">
              GosuGamers Data Scraper
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            {isError ? (
              <WifiOff className="h-4 w-4 text-destructive" />
            ) : (
              <Wifi className="h-4 w-4 text-chart-3" />
            )}
            <span className="text-xs text-muted-foreground">
              {isError ? "Offline - Using cached data" : "Connected to GosuGamers"}
            </span>
          </div>

          {lastUpdated && (
            <span className="hidden text-xs text-muted-foreground lg:block">
              Updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
