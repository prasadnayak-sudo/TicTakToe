import type { Move, Player } from '../types/game'

const SIZE = 3

/** 0-8 index ko "r2c3" jaise human-readable coordinate mein badalta hai. */
export function squareLabel(index: number): string {
  const row = Math.floor(index / SIZE) + 1
  const col = (index % SIZE) + 1
  return `r${row}c${col}`
}

export function moveLabel(move: Move, step: number): string {
  return `${step + 1}. ${move.player} → ${squareLabel(move.index)}`
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function playerLabel(player: Player, isComputer: boolean): string {
  return isComputer ? `Computer (${player})` : player
}
