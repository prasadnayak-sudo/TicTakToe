import type { Player, Result, Stats } from '../types/game'

export const EMPTY_STATS: Stats = {
  X: 0,
  O: 0,
  draws: 0,
  currentStreak: null,
  bestStreak: 0,
  bestStreakBy: null,
}

function nextStreak(stats: Stats, winner: Player) {
  const continuing = stats.currentStreak?.player === winner
  return {
    player: winner,
    length: continuing ? stats.currentStreak!.length + 1 : 1,
  }
}

/** Khatam hue round ka result stats mein jodta hai. Draw streak todta hai. */
export function recordResult(stats: Stats, result: Result): Stats {
  if (result.status === 'draw') {
    return { ...stats, draws: stats.draws + 1, currentStreak: null }
  }
  if (result.status !== 'won') return stats

  const streak = nextStreak(stats, result.winner)
  // Barabari par purana record hi rehta hai — best streak tabhi badalti hai
  // jab koi use sach mein tod de.
  const beatsBest = streak.length > stats.bestStreak
  return {
    ...stats,
    [result.winner]: stats[result.winner] + 1,
    currentStreak: streak,
    bestStreak: beatsBest ? streak.length : stats.bestStreak,
    bestStreakBy: beatsBest ? streak.player : stats.bestStreakBy,
  }
}

/**
 * localStorage se aayi stats ko bharosemand banata hai.
 *
 * Wahan ka data purane app version ka ho sakta hai, ya kisi ne haath se badal
 * diya ho — aur loadJSON sirf JSON.parse karke type maan leta hai. Isliye har
 * field yahan check hoti hai, warna ek missing field poori scoreboard todh
 * deti hai.
 */
export function normalizeStats(value: unknown): Stats {
  if (typeof value !== 'object' || value === null) return EMPTY_STATS
  const raw = value as Record<string, unknown>

  const count = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0

  const player = (v: unknown): Player | null => (v === 'X' || v === 'O' ? v : null)

  const streak = (v: unknown) => {
    if (typeof v !== 'object' || v === null) return null
    const s = v as Record<string, unknown>
    const who = player(s.player)
    const length = count(s.length)
    return who && length > 0 ? { player: who, length } : null
  }

  const bestStreak = count(raw.bestStreak)
  return {
    X: count(raw.X),
    O: count(raw.O),
    draws: count(raw.draws),
    currentStreak: streak(raw.currentStreak),
    bestStreak,
    // Purana data bestStreakBy rakhta hi nahi tha, to wahan null hi milega.
    bestStreakBy: bestStreak > 0 ? player(raw.bestStreakBy) : null,
  }
}

export function totalGames(stats: Stats): number {
  return stats.X + stats.O + stats.draws
}

export function winRate(stats: Stats, player: Player): number {
  const total = totalGames(stats)
  return total === 0 ? 0 : stats[player] / total
}
