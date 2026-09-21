import { sizeOf } from './board'
import type { Board, GameRecord, Mode, Move, Result } from '../types/game'

/** Log itna hi bada rakho ki charts kaam ke rahen, storage bhare nahi. */
export const RECORD_LIMIT = 50

/**
 * Khatam ho chuke round ka record. Chalu game par null — caller ko decide
 * karne ki zaroorat nahi.
 */
export function toRecord(
  result: Result,
  game: { mode: Mode; board: Board; history: Move[] },
  at: number,
): GameRecord | null {
  if (result.status === 'playing') return null

  return {
    winner: result.status === 'won' ? result.winner : null,
    mode: game.mode,
    size: sizeOf(game.board),
    moves: game.history.length,
    opening: game.history[0]?.index ?? null,
    at,
  }
}

export function appendRecord(log: GameRecord[], record: GameRecord): GameRecord[] {
  return [...log, record].slice(-RECORD_LIMIT)
}

export type OutcomeCounts = { X: number; O: number; draws: number }

export function outcomeCounts(log: GameRecord[]): OutcomeCounts {
  return log.reduce<OutcomeCounts>(
    (counts, record) => {
      if (record.winner === null) return { ...counts, draws: counts.draws + 1 }
      return { ...counts, [record.winner]: counts[record.winner] + 1 }
    },
    { X: 0, O: 0, draws: 0 },
  )
}

/**
 * Har square par kitni baar game khuli. Sirf diye gaye size ke games ginte
 * hain — 3x3 aur 4x4 ke openings ek grid mein mila dena galat hoga.
 */
export function openingCounts(log: GameRecord[], size: number): number[] {
  const counts = Array(size * size).fill(0)
  for (const record of log) {
    if (record.size !== size) continue
    if (record.opening === null) continue
    if (record.opening < 0 || record.opening >= counts.length) continue
    counts[record.opening] += 1
  }
  return counts
}

export function averageMoves(log: GameRecord[]): number {
  if (log.length === 0) return 0
  return log.reduce((sum, r) => sum + r.moves, 0) / log.length
}
