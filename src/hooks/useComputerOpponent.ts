import { useEffect } from 'react'
import { chooseMove } from '../game/ai'
import type { Board, Difficulty, Player } from '../types/game'

/** Chaal dikhne ke baad hi computer jawab de, warna instant lagta hai. */
const THINKING_MS = 350

export function useComputerOpponent({
  board,
  player,
  difficulty,
  active,
  onMove,
}: {
  board: Board
  player: Player
  difficulty: Difficulty
  active: boolean
  onMove: (index: number) => void
}) {
  useEffect(() => {
    if (!active) return

    const timer = setTimeout(() => {
      const move = chooseMove(board, player, difficulty)
      if (move !== null) onMove(move)
    }, THINKING_MS)

    return () => clearTimeout(timer)
  }, [active, board, player, difficulty, onMove])
}
