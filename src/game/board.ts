import type { Board, BoardSize, Line, Player, Result } from '../types/game'

export const SIZES: readonly BoardSize[] = [3, 4]
export const DEFAULT_SIZE: BoardSize = 3

export const squareCount = (size: BoardSize): number => size * size

/** Board ka size uski length se hi nikalta hai — alag se store karne ki zaroorat nahi. */
export const sizeOf = (board: Board): BoardSize =>
  (Math.round(Math.sqrt(board.length)) as BoardSize)

export const emptyBoard = (size: BoardSize): Board =>
  Array(squareCount(size)).fill(null)

export const other = (player: Player): Player => (player === 'X' ? 'O' : 'X')

/** Har size ke liye lines ek hi baar banti hain, phir cache ho jaati hain. */
const lineCache = new Map<BoardSize, readonly Line[]>()

export function linesFor(size: BoardSize): readonly Line[] {
  const cached = lineCache.get(size)
  if (cached) return cached

  const lines: Line[] = []
  const at = (row: number, col: number) => row * size + col

  for (let row = 0; row < size; row++) {
    lines.push(Array.from({ length: size }, (_, col) => at(row, col)))
  }
  for (let col = 0; col < size; col++) {
    lines.push(Array.from({ length: size }, (_, row) => at(row, col)))
  }
  lines.push(Array.from({ length: size }, (_, i) => at(i, i)))
  lines.push(Array.from({ length: size }, (_, i) => at(i, size - 1 - i)))

  lineCache.set(size, lines)
  return lines
}

export function getResult(board: Board): Result {
  for (const line of linesFor(sizeOf(board))) {
    const first = board[line[0]]
    if (first && line.every((i) => board[i] === first)) {
      return { status: 'won', winner: first, line }
    }
  }
  return board.every(Boolean) ? { status: 'draw' } : { status: 'playing' }
}

export function emptySquares(board: Board): number[] {
  return board.reduce<number[]>(
    (acc, square, i) => (square === null ? [...acc, i] : acc),
    [],
  )
}

export function isPlayable(board: Board, index: number): boolean {
  return (
    index >= 0 &&
    index < board.length &&
    board[index] === null &&
    getResult(board).status === 'playing'
  )
}

/** Naya board lautata hai — original kabhi mutate nahi hota. */
export function applyMove(board: Board, index: number, player: Player): Board {
  const next = [...board]
  next[index] = player
  return next
}
