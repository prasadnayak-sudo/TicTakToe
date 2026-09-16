/**
 * Poore app ke shared types. Har layer (game logic, hooks, components) yahin
 * se types uthati hai — isliye is file ka blast radius sabse bada hai.
 */

export type Player = 'X' | 'O'
export type Square = Player | null
export type Board = Square[]
export type Line = readonly [number, number, number]

export type Mode = 'two-player' | 'computer'
export type Difficulty = 'easy' | 'medium' | 'hard'

export type Result =
  | { status: 'won'; winner: Player; line: Line }
  | { status: 'draw' }
  | { status: 'playing' }

export type Move = {
  index: number
  player: Player
}

export type Streak = {
  player: Player
  length: number
}

export type Stats = {
  X: number
  O: number
  draws: number
  currentStreak: Streak | null
  bestStreak: number
}

export type GameState = {
  board: Board
  turn: Player
  mode: Mode
  difficulty: Difficulty
  history: Move[]
  /** Har round mein pehla turn alternate hota hai, taki fair rahe. */
  starter: Player
}
