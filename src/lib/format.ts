import type { BoardSize, Move, Player } from '../types/game'

/** 0-based index ko "r2c3" jaise human-readable coordinate mein badalta hai. */
export function squareLabel(index: number, size: BoardSize): string {
  const row = Math.floor(index / size) + 1
  const col = (index % size) + 1
  return `r${row}c${col}`
}

export function moveLabel(move: Move, step: number, size: BoardSize): string {
  return `${step + 1}. ${move.player} → ${squareLabel(move.index, size)}`
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function playerLabel(player: Player, isComputer: boolean): string {
  return isComputer ? `Computer (${player})` : player
}

/** "3×3" jaisa label — selector aur stats key dono jagah use hota hai. */
export function sizeLabel(size: BoardSize): string {
  return `${size}×${size}`
}
