import { applyMove, emptySquares, getResult, other } from './board'
import type { Board, Difficulty, Player } from '../types/game'

/**
 * Score `player` ke nazariye se. Gehri jeet ki value kam rakhi hai taaki AI
 * jeet jitni jaldi ho sake close kare (aur haar ko jitna ho sake taale).
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

  const scores = emptySquares(board).map((i) =>
    minimax(applyMove(board, i, toMove), other(toMove), player, depth + 1),
  )

  return toMove === player ? Math.max(...scores) : Math.min(...scores)
}

/** Perfect move. Board bhara ho to null. */
export function bestMove(board: Board, player: Player): number | null {
  let best: { move: number; score: number } | null = null

  for (const move of emptySquares(board)) {
    const score = minimax(applyMove(board, move, player), other(player), player, 0)
    if (!best || score > best.score) best = { move, score }
  }

  return best?.move ?? null
}

export function randomMove(board: Board): number | null {
  const options = emptySquares(board)
  if (options.length === 0) return null
  return options[Math.floor(Math.random() * options.length)]
}

/** Medium par AI jaan-boojh ke kabhi-kabhi galti karta hai. */
const MISTAKE_CHANCE = 0.35

export function chooseMove(
  board: Board,
  player: Player,
  difficulty: Difficulty,
): number | null {
  if (emptySquares(board).length === 0) return null

  switch (difficulty) {
    case 'easy':
      return randomMove(board)
    case 'medium':
      return Math.random() < MISTAKE_CHANCE
        ? randomMove(board)
        : bestMove(board, player)
    case 'hard':
      return bestMove(board, player)
  }
}
