/**
 * Poore app ke shared types. Har layer (game logic, hooks, components) yahin
 * se types uthati hai — isliye is file ka blast radius sabse bada hai.
 */

export type Player = 'X' | 'O'
export type Square = Player | null
export type Board = Square[]
export type Line = readonly number[]

/** Board ki ek taraf ke squares. 3 = classic, 4 = chaar-in-a-row. */
export type BoardSize = 3 | 4

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
  /**
   * Best streak kiski thi. null tab hai jab wo streak per-player tracking se
   * pehle save hui thi — us waqt player record hota hi nahi tha, isliye use
   * guess karne ke bajaye khali chhoda jaata hai.
   */
  bestStreakBy: Player | null
}

/** Ek khatam ho chuke round ka record — charts isi log se bante hain. */
export type GameRecord = {
  /** null ka matlab draw. */
  winner: Player | null
  mode: Mode
  size: BoardSize
  /** Round mein kul kitni chaalein chali. */
  moves: number
  /** Pehli chaal ka square index, ya null agar koi chaal hi na chali ho. */
  opening: number | null
  /** Epoch millis. */
  at: number
}

export type GameState = {
  board: Board
  turn: Player
  mode: Mode
  difficulty: Difficulty
  size: BoardSize
  history: Move[]
  /** Har round mein pehla turn alternate hota hai, taki fair rahe. */
  starter: Player
}
