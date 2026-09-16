import { applyMove, emptyBoard, other } from './board'
import type { Board, BoardSize, Mode, Move, Player } from '../types/game'

/** History ko replay karke board banata hai — board kabhi alag se store nahi hota. */
export function boardFromHistory(history: Move[], size: BoardSize): Board {
  return history.reduce<Board>(
    (board, move) => applyMove(board, move.index, move.player),
    emptyBoard(size),
  )
}

export function turnFromHistory(history: Move[], starter: Player): Player {
  const last = history[history.length - 1]
  return last ? other(last.player) : starter
}

/**
 * Computer ke against do ply wapas lete hain (computer ka jawab + apni chaal),
 * warna undo se turn computer ka ho jayega aur wo turant dobara khel dega.
 */
export function takeBack(history: Move[], mode: Mode): Move[] {
  const plies = mode === 'computer' ? 2 : 1
  return history.slice(0, Math.max(0, history.length - plies))
}

export function jumpTo(history: Move[], step: number): Move[] {
  return history.slice(0, Math.max(0, Math.min(step, history.length)))
}
