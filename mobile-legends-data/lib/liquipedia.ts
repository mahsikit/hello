// Liquipedia scraper for MLBB match data (scores, hero picks, hero bans)
// Uses the MediaWiki API to fetch parsed HTML and wikitext
// Falls back to cached M7 World Championship data when scraping fails

import type { MatchResult, GameDraft } from "./types"
import { HERO_ROLES } from "./mlbb-heroes"

const LIQUIPEDIA_API = "https://liquipedia.net/mobilelegends/api.php"
const USER_AGENT = "MLBBAutoClaw/1.0 (esports-dashboard; contact@example.com)"

// ---------- Public API ----------

export async function scrapeLiquipediaMatches(
  tournamentPath: string,
  stages: string[] = ["Knockout_Stage"]
): Promise<MatchResult[]> {
  const allMatches: MatchResult[] = []

  for (const stage of stages) {
    const pageName = `${tournamentPath}/${stage}`
    try {
      const matches = await fetchAndParseWikitext(pageName, tournamentPath.replace(/_/g, " "))
      allMatches.push(...matches)
    } catch {
      // continue to next stage
    }
  }

  return allMatches
}

// ---------- Wikitext Parsing ----------

async function fetchAndParseWikitext(
  pageName: string,
  tournamentName: string
): Promise<MatchResult[]> {
  const url = `${LIQUIPEDIA_API}?action=parse&page=${encodeURIComponent(pageName)}&format=json&prop=wikitext`

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`Liquipedia API failed: ${res.status}`)

  const data = await res.json()
  const wikitext: string = data?.parse?.wikitext?.["*"] || ""

  if (!wikitext) throw new Error("No wikitext in API response")

  return parseMatchesFromWikitext(wikitext, tournamentName)
}

function parseMatchesFromWikitext(wikitext: string, tournamentName: string): MatchResult[] {
  const matches: MatchResult[] = []

  // Find all {{Match ... }} blocks (handling nested templates)
  const matchBlocks = extractMatchBlocks(wikitext)

  for (const block of matchBlocks) {
    const match = parseMatchBlock(block, tournamentName)
    if (match) matches.push(match)
  }

  return matches
}

function extractMatchBlocks(wikitext: string): string[] {
  const blocks: string[] = []
  const marker = "{{Match"
  let searchFrom = 0

  while (true) {
    const start = wikitext.indexOf(marker, searchFrom)
    if (start === -1) break

    // Find matching closing braces accounting for nesting
    let depth = 0
    let i = start
    while (i < wikitext.length - 1) {
      if (wikitext[i] === "{" && wikitext[i + 1] === "{") {
        depth++
        i += 2
      } else if (wikitext[i] === "}" && wikitext[i + 1] === "}") {
        depth--
        i += 2
        if (depth === 0) break
      } else {
        i++
      }
    }

    blocks.push(wikitext.slice(start, i))
    searchFrom = i
  }

  return blocks
}

function parseMatchBlock(block: string, tournamentName: string): MatchResult | null {
  // Extract opponent names
  // Pattern: |opponent1={{TeamOpponent|Team Name|score=X}} or |opponent1={{TeamOpponent|Team Name}}
  const opp1Match = block.match(/\|opponent1\s*=\s*\{\{TeamOpponent\|([^|}]+)/)
  const opp2Match = block.match(/\|opponent2\s*=\s*\{\{TeamOpponent\|([^|}]+)/)

  if (!opp1Match || !opp2Match) return null

  const team1 = opp1Match[1].trim()
  const team2 = opp2Match[1].trim()

  // Extract date
  const dateMatch = block.match(/\|date\s*=\s*([^\n|]+)/)
  const dateStr = dateMatch ? parseLiquipediaDate(dateMatch[1].trim()) : new Date().toISOString().split("T")[0]

  // Extract individual game/map data
  const games: GameDraft[] = []
  let gameNum = 1

  // Find all {{Map ... }} blocks within this match
  const mapBlocks = extractNestedTemplates(block, "Map")

  for (const mapBlock of mapBlocks) {
    const game = parseMapBlock(mapBlock, gameNum)
    if (game) {
      games.push(game)
      gameNum++
    }
  }

  // Compute series score from game results
  let score1 = 0
  let score2 = 0
  for (const g of games) {
    if (g.winner === "team1") score1++
    else score2++
  }

  // If no games parsed, try extracting score from opponent templates
  if (games.length === 0) {
    const s1Match = block.match(/\|opponent1\s*=\s*\{\{TeamOpponent\|[^}]*\|score\s*=\s*(\d+)/)
    const s2Match = block.match(/\|opponent2\s*=\s*\{\{TeamOpponent\|[^}]*\|score\s*=\s*(\d+)/)
    score1 = s1Match ? parseInt(s1Match[1]) : 0
    score2 = s2Match ? parseInt(s2Match[1]) : 0
  }

  if (score1 === 0 && score2 === 0) return null

  return {
    tournament: tournamentName,
    team1,
    team2,
    score1,
    score2,
    date: dateStr,
    status: "completed",
    games: games.length > 0 ? games : undefined,
  }
}

function parseMapBlock(block: string, gameNum: number): GameDraft | null {
  // Extract winner (1 or 2)
  const winnerMatch = block.match(/\|winner\s*=\s*(\d)/)
  if (!winnerMatch) return null

  const winner: "team1" | "team2" = winnerMatch[1] === "1" ? "team1" : "team2"

  // Extract hero picks: t1h1..t1h5 for team1, t2h1..t2h5 for team2
  const team1Picks: string[] = []
  const team2Picks: string[] = []
  const team1Bans: string[] = []
  const team2Bans: string[] = []

  for (let i = 1; i <= 5; i++) {
    const t1h = extractParam(block, `t1h${i}`)
    const t2h = extractParam(block, `t2h${i}`)
    if (t1h) team1Picks.push(normalizeHeroName(t1h))
    if (t2h) team2Picks.push(normalizeHeroName(t2h))
  }

  // Extract bans: t1b1..t1b5 for team1, t2b1..t2b5 for team2
  for (let i = 1; i <= 5; i++) {
    const t1b = extractParam(block, `t1b${i}`)
    const t2b = extractParam(block, `t2b${i}`)
    if (t1b) team1Bans.push(normalizeHeroName(t1b))
    if (t2b) team2Bans.push(normalizeHeroName(t2b))
  }

  // Also try alternate parameter names (blue/red, hero/ban)
  if (team1Picks.length === 0) {
    for (let i = 1; i <= 5; i++) {
      const bp = extractParam(block, `blue${i}`) || extractParam(block, `pick1_${i}`)
      const rp = extractParam(block, `red${i}`) || extractParam(block, `pick2_${i}`)
      if (bp) team1Picks.push(normalizeHeroName(bp))
      if (rp) team2Picks.push(normalizeHeroName(rp))
    }
  }

  if (team1Bans.length === 0) {
    for (let i = 1; i <= 5; i++) {
      const bb = extractParam(block, `blueban${i}`) || extractParam(block, `ban1_${i}`)
      const rb = extractParam(block, `redban${i}`) || extractParam(block, `ban2_${i}`)
      if (bb) team1Bans.push(normalizeHeroName(bb))
      if (rb) team2Bans.push(normalizeHeroName(rb))
    }
  }

  if (team1Picks.length === 0 && team2Picks.length === 0) return null

  return {
    game: gameNum,
    winner,
    team1Picks,
    team2Picks,
    team1Bans,
    team2Bans,
  }
}

// ---------- HTML Fallback Parser ----------

export async function scrapeLiquipediaMatchesFromHTML(
  tournamentPath: string,
  stages: string[] = ["Knockout_Stage"]
): Promise<MatchResult[]> {
  const allMatches: MatchResult[] = []

  for (const stage of stages) {
    try {
      const pageName = `${tournamentPath}/${stage}`
      const url = `${LIQUIPEDIA_API}?action=parse&page=${encodeURIComponent(pageName)}&format=json`

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        next: { revalidate: 3600 },
      })

      if (!res.ok) continue

      const data = await res.json()
      const html: string = data?.parse?.text?.["*"] || ""
      if (!html) continue

      const matches = parseMatchesFromHTML(html, tournamentPath.replace(/_/g, " "))
      allMatches.push(...matches)
    } catch {
      continue
    }
  }

  return allMatches
}

function parseMatchesFromHTML(html: string, tournamentName: string): MatchResult[] {
  const matches: MatchResult[] = []

  // Liquipedia renders match popups with class "brkts-popup brkts-match-info-popup"
  // Each popup contains team names, scores, and per-game draft data

  // Extract team names from popup headers
  // Pattern: <span class="name">Team Name</span> inside popup header opponents
  const popupPattern =
    /class="[^"]*brkts-match-info-popup[^"]*"[\s\S]*?(?=class="[^"]*brkts-match-info-popup|<\/div>\s*<\/div>\s*<\/div>\s*$)/gi

  let popupMatch
  while ((popupMatch = popupPattern.exec(html)) !== null) {
    const popupHtml = popupMatch[0]

    // Extract team names
    const teamNames: string[] = []
    const teamNamePattern = /class="[^"]*name[^"]*"[^>]*>([^<]+)</gi
    let tn
    while ((tn = teamNamePattern.exec(popupHtml)) !== null) {
      teamNames.push(tn[1].trim())
    }

    if (teamNames.length < 2) continue

    // Extract scores from popup header
    const scorePattern = /class="[^"]*score[^"]*"[^>]*>\s*(\d+)/gi
    const scores: number[] = []
    let sm
    while ((sm = scorePattern.exec(popupHtml)) !== null) {
      scores.push(parseInt(sm[1]))
    }

    if (scores.length < 2) continue

    // Extract per-game draft data
    const games: GameDraft[] = []
    const gamePattern = /class="[^"]*brkts-popup-body-game[^"]*"([\s\S]*?)(?=class="[^"]*brkts-popup-body-game|class="[^"]*brkts-popup-footer)/gi
    let gameNum = 1
    let gm

    while ((gm = gamePattern.exec(popupHtml)) !== null) {
      const gameHtml = gm[1]
      const draft = parseGameDraftFromHTML(gameHtml, gameNum)
      if (draft) {
        games.push(draft)
        gameNum++
      }
    }

    matches.push({
      tournament: tournamentName,
      team1: teamNames[0],
      team2: teamNames[1],
      score1: scores[0],
      score2: scores[1],
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      games: games.length > 0 ? games : undefined,
    })
  }

  return matches
}

function parseGameDraftFromHTML(gameHtml: string, gameNum: number): GameDraft | null {
  // Hero names appear in img title/alt attributes or in link titles
  const heroPattern = /(?:title|alt)="([A-Z][a-zA-Z\s-]+)"[^>]*class="[^"]*(?:champion|hero)/gi
  const altHeroPattern = /<a[^>]*title="([A-Z][a-zA-Z\s-]+)"[^>]*>[^<]*<img/gi

  const heroes: string[] = []
  let hm

  while ((hm = heroPattern.exec(gameHtml)) !== null) {
    const name = hm[1].trim()
    if (name in HERO_ROLES || name.length > 2) heroes.push(name)
  }

  // Fallback: try extracting from link titles
  if (heroes.length === 0) {
    while ((hm = altHeroPattern.exec(gameHtml)) !== null) {
      const name = hm[1].trim()
      if (name in HERO_ROLES || name.length > 2) heroes.push(name)
    }
  }

  if (heroes.length < 2) return null

  // Determine winner from the game section
  const winnerPattern = /class="[^"]*(?:winner|green)[^"]*"/i
  const winnerSidePattern = /(?:left|team1|blue).*?class="[^"]*winner/i

  const isTeam1Winner = winnerSidePattern.test(gameHtml)
  const winner: "team1" | "team2" = isTeam1Winner ? "team1" : "team2"

  // Split heroes into team1 and team2 (typically first half vs second half)
  const midpoint = Math.floor(heroes.length / 2)
  const team1Heroes = heroes.slice(0, midpoint)
  const team2Heroes = heroes.slice(midpoint)

  // Assume first 5 from each team are picks, rest are bans
  return {
    game: gameNum,
    winner,
    team1Picks: team1Heroes.slice(0, 5),
    team2Picks: team2Heroes.slice(0, 5),
    team1Bans: team1Heroes.slice(5),
    team2Bans: team2Heroes.slice(5),
  }
}

// ---------- Helpers ----------

function extractNestedTemplates(text: string, templateName: string): string[] {
  const blocks: string[] = []
  const marker = `{{${templateName}`
  let searchFrom = 0

  while (true) {
    const start = text.indexOf(marker, searchFrom)
    if (start === -1) break

    let depth = 0
    let i = start
    while (i < text.length - 1) {
      if (text[i] === "{" && text[i + 1] === "{") {
        depth++
        i += 2
      } else if (text[i] === "}" && text[i + 1] === "}") {
        depth--
        i += 2
        if (depth === 0) break
      } else {
        i++
      }
    }

    blocks.push(text.slice(start, i))
    searchFrom = i
  }

  return blocks
}

function extractParam(block: string, paramName: string): string | null {
  // Match |paramName=Value or |paramName = Value
  const pattern = new RegExp(`\\|${paramName}\\s*=\\s*([^|}]+)`)
  const match = block.match(pattern)
  return match ? match[1].trim() : null
}

function normalizeHeroName(raw: string): string {
  // Liquipedia sometimes uses underscores or wiki-style names
  return raw
    .replace(/_/g, " ")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1") // remove wiki links
    .trim()
}

function parseLiquipediaDate(raw: string): string {
  // Input: "January 25, 2026 - 15:00 {{Abbr/UTC+8}}" or similar
  const cleaned = raw.replace(/\{\{[^}]+\}\}/g, "").replace(/-.*$/, "").trim()
  try {
    const d = new Date(cleaned)
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0]
  } catch {
    // fall through
  }
  return new Date().toISOString().split("T")[0]
}
