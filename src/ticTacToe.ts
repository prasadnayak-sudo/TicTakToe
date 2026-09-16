export type Player = 'X' | 'O'
export type Square = Player | null
export type Board = Square[]

export const EMPTY_BOARD: Board = Array(9).fill(null)

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export type Result =
  | { status: 'won'; winner: Player; line: readonly [number, number, number] }
  | { status: 'draw' }
  | { status: 'playing' }

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

const other = (player: Player): Player => (player === 'X' ? 'O' : 'X')

/**
 * Score for `player` from the perspective of whoever is to move, with deeper
 * wins valued less so the AI closes out games (and stalls losses) as fast as it can.
 */
function minimax(
  board: Board,
  toMove: Player,
  player: Player,
  depth: number,
): number {
  const result = getResult(board)
  if (result.status === 'won') {
    return result.winner === player ? 10 - depth : depth - 10
  }
  if (result.status === 'draw') return 0

  const scores = emptySquares(board).map((i) => {
    const next = [...board]
    next[i] = toMove
    return minimax(next, other(toMove), player, depth + 1)
  })

  return toMove === player ? Math.max(...scores) : Math.min(...scores)
}

/** The strongest move for `player`, or null when the board is full. */
export function bestMove(board: Board, player: Player): number | null {
  let best: { move: number; score: number } | null = null

  for (const move of emptySquares(board)) {
    const next = [...board]
    next[move] = player
    const score = minimax(next, other(player), player, 0)
    if (!best || score > best.score) best = { move, score }
  }

  return best?.move ?? null
}
