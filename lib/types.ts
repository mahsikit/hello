import type { HeroStatEntry } from "./mlbb-heroes"

export interface Team {
  rank: number
  name: string
  region: string
  elo: number
  winRate: string
  streak: string
  logo?: string
}

export interface GameDraft {
  game: number
  winner: "team1" | "team2"
  team1Picks: string[]
  team2Picks: string[]
  team1Bans: string[]
  team2Bans: string[]
}

export interface MatchResult {
  tournament: string
  team1: string
  team2: string
  score1: number
  score2: number
  date: string
  status: "completed" | "live" | "upcoming"
  games?: GameDraft[]
  gosuGamersUrl?: string
  liquipediaUrl?: string
}

export interface Tournament {
  name: string
  status: "ongoing" | "upcoming" | "past"
  prizePool: string
  startDate: string
  endDate: string
  teams: number
  region: string
}

export interface GosuGamersData {
  rankings: Team[]
  matches: MatchResult[]
  tournaments: Tournament[]
  heroStats: HeroStatEntry[]
  lastUpdated: string
  source: string
}
