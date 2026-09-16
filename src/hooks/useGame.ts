import { useCallback, useMemo, useReducer } from 'react'
import { getResult, isPlayable, other } from '../game/board'
import { boardFromHistory, jumpTo, takeBack, turnFromHistory } from '../game/history'
import type { Difficulty, GameState, Mode, Move } from '../types/game'

type Action =
  | { type: 'play'; index: number }
  | { type: 'undo' }
  | { type: 'jump'; step: number }
  | { type: 'newRound' }
  | { type: 'setMode'; mode: Mode }
  | { type: 'setDifficulty'; difficulty: Difficulty }

const INITIAL: GameState = {
  board: boardFromHistory([]),
  turn: 'X',
  mode: 'two-player',
  difficulty: 'hard',
  history: [],
  starter: 'X',
}

/** History hi single source of truth hai; board/turn usi se derive hote hain. */
function fromHistory(state: GameState, history: Move[]): GameState {
  return {
    ...state,
    history,
    board: boardFromHistory(history),
    turn: turnFromHistory(history, state.starter),
  }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'play': {
      if (!isPlayable(state.board, action.index)) return state
      return fromHistory(state, [
        ...state.history,
        { index: action.index, player: state.turn },
      ])
    }
    case 'undo':
      return fromHistory(state, takeBack(state.history, state.mode))
    case 'jump':
      return fromHistory(state, jumpTo(state.history, action.step))
    case 'newRound': {
      // Agla round doosra player shuru karta hai.
      const starter = other(state.starter)
      return { ...fromHistory({ ...state, starter }, []), starter }
    }
    case 'setMode':
      return action.mode === state.mode
        ? state
        : { ...fromHistory({ ...state, starter: 'X' }, []), mode: action.mode, starter: 'X' }
    case 'setDifficulty':
      return { ...state, difficulty: action.difficulty }
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const result = useMemo(() => getResult(state.board), [state.board])

  const play = useCallback((index: number) => dispatch({ type: 'play', index }), [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const jump = useCallback((step: number) => dispatch({ type: 'jump', step }), [])
  const newRound = useCallback(() => dispatch({ type: 'newRound' }), [])
  const setMode = useCallback((mode: Mode) => dispatch({ type: 'setMode', mode }), [])
  const setDifficulty = useCallback(
    (difficulty: Difficulty) => dispatch({ type: 'setDifficulty', difficulty }),
    [],
  )

  return { ...state, result, play, undo, jump, newRound, setMode, setDifficulty }
}
