import { applyMove, emptySquares, getResult, linesFor, other, sizeOf } from './board'
import type { Board, Difficulty, Player } from '../types/game'

/**
 * Itne khaali squares tak poora search chalta hai (perfect play). 3x3 hamesha
 * isme aa jaata hai; 4x4 sirf endgame mein. Usse pehle depth-limited search
 * chalta hai, kyunki 16 squares ka full tree 20 trillion se bada hai.
 */
const FULL_SEARCH_SQUARES = 9
const MAX_DEPTH = 4

const WIN_SCORE = 1000

/**
 * Adhoori lines ko score karta hai: jitni marks ek hi player ki ho aur line
 * blocked na ho, utni wo line keemti hai.
 */
function evaluate(board: Board, player: Player): number {
  const opponent = other(player)
  let score = 0

  for (const line of linesFor(sizeOf(board))) {
    let mine = 0
    let theirs = 0
    for (const i of line) {
      if (board[i] === player) mine++
      else if (board[i] === opponent) theirs++
    }
    // Mili-juli line kisi ke kaam ki nahi — dono block kar chuke hain.
    if (mine > 0 && theirs > 0) continue
    if (mine > 0) score += 10 ** mine
    else if (theirs > 0) score -= 10 ** theirs
  }

  return score
}

/**
 * Score `player` ke nazariye se. Gehri jeet ki value kam rakhi hai taaki AI
 * jeet jitni jaldi ho sake close kare (aur haar ko jitna ho sake taale).
 */
function minimax(
  board: Board,
  toMove: Player,
  player: Player,
  depth: number,
  limit: number,
  alpha: number,
  beta: number,
): number {
  const result = getResult(board)
  if (result.status === 'won') {
    return result.winner === player ? WIN_SCORE - depth : depth - WIN_SCORE
  }
  if (result.status === 'draw') return 0
  if (depth >= limit) return evaluate(board, player)

  const maximising = toMove === player
  let best = maximising ? -Infinity : Infinity

  for (const i of emptySquares(board)) {
    const score = minimax(
      applyMove(board, i, toMove),
      other(toMove),
      player,
      depth + 1,
      limit,
      alpha,
      beta,
    )

    if (maximising) {
      best = Math.max(best, score)
      alpha = Math.max(alpha, best)
    } else {
      best = Math.min(best, score)
      beta = Math.min(beta, best)
    }
    // Is branch ka natija upar wale player kabhi chunega hi nahi.
    if (beta <= alpha) break
  }

  return best
}

/** Perfect (ya 4x4 par sabse achhi dikhne wali) move. Board bhara ho to null. */
export function bestMove(board: Board, player: Player): number | null {
  const options = emptySquares(board)
  if (options.length === 0) return null

  const limit = options.length <= FULL_SEARCH_SQUARES ? Infinity : MAX_DEPTH

  let best: { move: number; score: number } | null = null
  for (const move of options) {
    const score = minimax(
      applyMove(board, move, player),
      other(player),
      player,
      0,
      limit,
      -Infinity,
      Infinity,
    )
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
