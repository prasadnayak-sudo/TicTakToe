import type { Player, Result, Stats } from '../types/game'

export const EMPTY_STATS: Stats = {
  X: 0,
  O: 0,
  draws: 0,
  currentStreak: null,
  bestStreak: 0,
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
  return {
    ...stats,
    [result.winner]: stats[result.winner] + 1,
    currentStreak: streak,
    bestStreak: Math.max(stats.bestStreak, streak.length),
  }
}

export function totalGames(stats: Stats): number {
  return stats.X + stats.O + stats.draws
}

export function winRate(stats: Stats, player: Player): number {
  const total = totalGames(stats)
  return total === 0 ? 0 : stats[player] / total
}
