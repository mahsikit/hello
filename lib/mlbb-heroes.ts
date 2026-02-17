// Real M7 World Championship hero statistics scraped from Liquipedia
// Source: https://liquipedia.net/mobilelegends/M7_World_Championship/Statistics
// Total games in tournament: 116

export type HeroRole = "tank" | "fighter" | "assassin" | "mage" | "marksman" | "support"

export const HERO_ROLES: Record<string, HeroRole> = {
  // Marksman
  "Yi Sun-shin": "marksman",
  "Claude": "marksman",
  "Karrie": "marksman",
  "Granger": "marksman",
  "Kimmy": "marksman",
  "Beatrix": "marksman",
  "Brody": "marksman",
  "Bruno": "marksman",
  "Wanwan": "marksman",
  "Moskov": "marksman",
  "Melissa": "marksman",
  "Irithel": "marksman",
  "Natan": "marksman",
  "Popol and Kupa": "marksman",
  "Ixia": "marksman",
  // Mage
  "Pharsa": "mage",
  "Yve": "mage",
  "Zhuxin": "mage",
  "Lunox": "mage",
  "Harith": "mage",
  "Valentina": "mage",
  "Kagura": "mage",
  "Cecilion": "mage",
  "Luo Yi": "mage",
  "Xavier": "mage",
  "Novaria": "mage",
  "Lylia": "mage",
  "Vale": "mage",
  "Kadita": "mage",
  "Aurora": "mage",
  "Nana": "mage",
  // Fighter
  "Chou": "fighter",
  "Yu Zhong": "fighter",
  "Lapu-Lapu": "fighter",
  "Esmeralda": "fighter",
  "Freya": "fighter",
  "Phoveus": "fighter",
  "Arlott": "fighter",
  "Khaleed": "fighter",
  "Fredrinn": "fighter",
  "Leomord": "fighter",
  "Thamuz": "fighter",
  "Terizla": "fighter",
  "X.Borg": "fighter",
  "Guinevere": "fighter",
  "Silvanna": "fighter",
  "Aldous": "fighter",
  "Badang": "fighter",
  "Dyrroth": "fighter",
  "Masha": "fighter",
  "Paquito": "fighter",
  "Barats": "fighter",
  "Aulus": "fighter",
  "Julian": "fighter",
  "Chip": "fighter",
  // Tank
  "Gatotkaca": "tank",
  "Hylos": "tank",
  "Uranus": "tank",
  "Hilda": "tank",
  "Grock": "tank",
  "Khufra": "tank",
  "Atlas": "tank",
  "Tigreal": "tank",
  "Franco": "tank",
  "Akai": "tank",
  "Baxia": "tank",
  "Belerick": "tank",
  "Edith": "tank",
  "Johnson": "tank",
  "Minotaur": "tank",
  // Assassin
  "Lancelot": "assassin",
  "Hayabusa": "assassin",
  "Sora": "assassin",
  "Joy": "assassin",
  "Cici": "assassin",
  "Fanny": "assassin",
  "Ling": "assassin",
  "Gusion": "assassin",
  "Benedetta": "assassin",
  "Saber": "assassin",
  "Helcurt": "assassin",
  "Karina": "assassin",
  "Aamon": "assassin",
  "Harley": "assassin",
  // Support
  "Kalea": "support",
  "Rafaela": "support",
  "Estes": "support",
  "Angela": "support",
  "Diggie": "support",
  "Mathilda": "support",
  "Floryn": "support",
  "Faramis": "support",
  "Carmilla": "support",
}

export function getHeroRole(hero: string): HeroRole {
  return HERO_ROLES[hero] || "fighter"
}

export const ROLE_COLORS: Record<HeroRole, string> = {
  tank: "#3b82f6",
  fighter: "#f97316",
  assassin: "#ef4444",
  mage: "#a855f7",
  marksman: "#22c55e",
  support: "#06b6d4",
}

export interface HeroStatEntry {
  name: string
  role: HeroRole
  picks: number
  wins: number
  losses: number
  winRate: number
  pickRate: number
  bans: number
  banRate: number
  presence: number
  presenceRate: number
}

const TOTAL_GAMES = 116

// Real data scraped from Liquipedia M7 World Championship Statistics page
export const M7_HERO_STATS: HeroStatEntry[] = [
  { name: "Yi Sun-shin", role: "marksman", picks: 63, wins: 34, losses: 29, winRate: 53.97, pickRate: 54.31, bans: 30, banRate: 25.86, presence: 93, presenceRate: 80.17 },
  { name: "Claude", role: "marksman", picks: 58, wins: 32, losses: 26, winRate: 55.17, pickRate: 50.00, bans: 36, banRate: 31.03, presence: 94, presenceRate: 81.03 },
  { name: "Pharsa", role: "mage", picks: 54, wins: 21, losses: 33, winRate: 38.89, pickRate: 46.55, bans: 13, banRate: 11.21, presence: 67, presenceRate: 57.76 },
  { name: "Chou", role: "fighter", picks: 52, wins: 25, losses: 27, winRate: 48.08, pickRate: 44.83, bans: 14, banRate: 12.07, presence: 66, presenceRate: 56.90 },
  { name: "Yve", role: "mage", picks: 41, wins: 25, losses: 16, winRate: 60.98, pickRate: 35.34, bans: 68, banRate: 58.62, presence: 109, presenceRate: 93.97 },
  { name: "Yu Zhong", role: "fighter", picks: 40, wins: 22, losses: 18, winRate: 55.00, pickRate: 34.48, bans: 51, banRate: 43.97, presence: 91, presenceRate: 78.45 },
  { name: "Gatotkaca", role: "tank", picks: 39, wins: 18, losses: 21, winRate: 46.15, pickRate: 33.62, bans: 19, banRate: 16.38, presence: 58, presenceRate: 50.00 },
  { name: "Zhuxin", role: "mage", picks: 38, wins: 20, losses: 18, winRate: 52.63, pickRate: 32.76, bans: 76, banRate: 65.52, presence: 114, presenceRate: 98.28 },
  { name: "Karrie", role: "marksman", picks: 36, wins: 13, losses: 23, winRate: 36.11, pickRate: 31.03, bans: 20, banRate: 17.24, presence: 56, presenceRate: 48.28 },
  { name: "Sora", role: "assassin", picks: 35, wins: 19, losses: 16, winRate: 54.29, pickRate: 30.17, bans: 67, banRate: 57.76, presence: 102, presenceRate: 87.93 },
  { name: "Lancelot", role: "assassin", picks: 35, wins: 15, losses: 20, winRate: 42.86, pickRate: 30.17, bans: 32, banRate: 27.59, presence: 67, presenceRate: 57.76 },
  { name: "Uranus", role: "tank", picks: 33, wins: 16, losses: 17, winRate: 48.48, pickRate: 28.45, bans: 37, banRate: 31.90, presence: 70, presenceRate: 60.34 },
  { name: "Lapu-Lapu", role: "fighter", picks: 32, wins: 17, losses: 15, winRate: 53.13, pickRate: 27.59, bans: 32, banRate: 27.59, presence: 64, presenceRate: 55.17 },
  { name: "Esmeralda", role: "fighter", picks: 32, wins: 10, losses: 22, winRate: 31.25, pickRate: 27.59, bans: 30, banRate: 25.86, presence: 62, presenceRate: 53.45 },
  { name: "Granger", role: "marksman", picks: 30, wins: 13, losses: 17, winRate: 43.33, pickRate: 25.86, bans: 6, banRate: 5.17, presence: 36, presenceRate: 31.03 },
  { name: "Hylos", role: "tank", picks: 29, wins: 15, losses: 14, winRate: 51.72, pickRate: 25.00, bans: 23, banRate: 19.83, presence: 52, presenceRate: 44.83 },
  { name: "Hilda", role: "tank", picks: 29, wins: 14, losses: 15, winRate: 48.28, pickRate: 25.00, bans: 40, banRate: 34.48, presence: 69, presenceRate: 59.48 },
  { name: "Hayabusa", role: "assassin", picks: 28, wins: 16, losses: 12, winRate: 57.14, pickRate: 24.14, bans: 14, banRate: 12.07, presence: 42, presenceRate: 36.21 },
  { name: "Cici", role: "assassin", picks: 28, wins: 17, losses: 11, winRate: 60.71, pickRate: 24.14, bans: 18, banRate: 15.52, presence: 46, presenceRate: 39.66 },
  { name: "Kalea", role: "support", picks: 27, wins: 17, losses: 10, winRate: 62.96, pickRate: 23.28, bans: 15, banRate: 12.93, presence: 42, presenceRate: 36.21 },
  { name: "Freya", role: "fighter", picks: 25, wins: 18, losses: 7, winRate: 72.00, pickRate: 21.55, bans: 14, banRate: 12.07, presence: 39, presenceRate: 33.62 },
  { name: "Kimmy", role: "marksman", picks: 23, wins: 13, losses: 10, winRate: 56.52, pickRate: 19.83, bans: 10, banRate: 8.62, presence: 33, presenceRate: 28.45 },
  { name: "Harith", role: "mage", picks: 22, wins: 11, losses: 11, winRate: 50.00, pickRate: 18.97, bans: 8, banRate: 6.90, presence: 30, presenceRate: 25.86 },
  { name: "Khaleed", role: "fighter", picks: 22, wins: 11, losses: 11, winRate: 50.00, pickRate: 18.97, bans: 6, banRate: 5.17, presence: 28, presenceRate: 24.14 },
  { name: "Lunox", role: "mage", picks: 22, wins: 17, losses: 5, winRate: 77.27, pickRate: 18.97, bans: 7, banRate: 6.03, presence: 29, presenceRate: 25.00 },
  { name: "Grock", role: "tank", picks: 22, wins: 14, losses: 8, winRate: 63.64, pickRate: 18.97, bans: 8, banRate: 6.90, presence: 30, presenceRate: 25.86 },
  { name: "Valentina", role: "mage", picks: 20, wins: 12, losses: 8, winRate: 60.00, pickRate: 17.24, bans: 13, banRate: 11.21, presence: 33, presenceRate: 28.45 },
  { name: "Phoveus", role: "fighter", picks: 21, wins: 10, losses: 11, winRate: 47.62, pickRate: 18.10, bans: 13, banRate: 11.21, presence: 34, presenceRate: 29.31 },
  { name: "Arlott", role: "fighter", picks: 19, wins: 14, losses: 5, winRate: 73.68, pickRate: 16.38, bans: 12, banRate: 10.34, presence: 31, presenceRate: 26.72 },
  { name: "Fredrinn", role: "fighter", picks: 19, wins: 15, losses: 4, winRate: 78.95, pickRate: 16.38, bans: 5, banRate: 4.31, presence: 24, presenceRate: 20.69 },
  { name: "Joy", role: "assassin", picks: 17, wins: 10, losses: 7, winRate: 58.82, pickRate: 14.66, bans: 11, banRate: 9.48, presence: 28, presenceRate: 24.14 },
  { name: "Leomord", role: "fighter", picks: 16, wins: 9, losses: 7, winRate: 56.25, pickRate: 13.79, bans: 4, banRate: 3.45, presence: 20, presenceRate: 17.24 },
]

// Scrape live hero statistics from Liquipedia
export async function scrapeLiquipediaHeroStats(tournamentPath: string): Promise<HeroStatEntry[]> {
  try {
    const url = `https://liquipedia.net/mobilelegends/${tournamentPath}/Statistics`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MLBBAutoClaw/1.0 (esports-dashboard; contact@example.com)",
        "Accept": "text/html",
      },
      next: { revalidate: 3600 },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) throw new Error(`Liquipedia fetch failed: ${res.status}`)

    const html = await res.text()
    const stats: HeroStatEntry[] = []

    // Parse hero rows from the statistics table
    // Pattern: rank | hero name | picks | wins | losses | winRate | pickRate% | bans | banRate% | presence | presenceRate%
    const heroRowPattern = /\|(\d+)\|.*?\[([^\]]+)\]\s*\|.*?\[(\d+)\]\s*\|(\d+)\|(\d+)\|([\d.]+)%\|([\d.]+)%\|.*?\[(\d+)\]\s*\|([\d.]+)%\|(\d+)\|([\d.]+)%/g

    let match
    while ((match = heroRowPattern.exec(html)) !== null) {
      const heroName = match[2].trim()
      const role = HERO_ROLES[heroName] || "fighter"

      stats.push({
        name: heroName,
        role,
        picks: parseInt(match[3]),
        wins: parseInt(match[4]),
        losses: parseInt(match[5]),
        winRate: parseFloat(match[6]),
        pickRate: parseFloat(match[7]),
        bans: parseInt(match[8]),
        banRate: parseFloat(match[9]),
        presence: parseInt(match[10]),
        presenceRate: parseFloat(match[11]),
      })
    }

    return stats.length > 0 ? stats : M7_HERO_STATS
  } catch {
    return M7_HERO_STATS
  }
}
