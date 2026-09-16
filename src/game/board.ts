import type { Board, Line, Player, Result } from '../types/game'

export const SIZE = 3
export const SQUARES = SIZE * SIZE

export const EMPTY_BOARD: Board = Array(SQUARES).fill(null)

export const LINES: readonly Line[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const other = (player: Player): Player => (player === 'X' ? 'O' : 'X')

export function getResult(board: Board): Result {
  for (const line of LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { status: 'won', winner: board[a], line }
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
    index < SQUARES &&
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
