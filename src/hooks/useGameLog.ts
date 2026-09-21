import { useCallback } from 'react'
import { appendRecord } from '../game/records'
import { useLocalStorage } from './useLocalStorage'
import type { GameRecord } from '../types/game'

/**
 * Khatam hue rounds ka log. Stats ke ulta, ye mode/size ke hisaab se alag nahi
 * hota — charts ko poori history chahiye taaki unhe filter karne ka mauka mile.
 */
const STORAGE_KEY = 'ttt:log'

export function useGameLog() {
  const [log, setLog] = useLocalStorage<GameRecord[]>(STORAGE_KEY, [])

  const add = useCallback(
    (record: GameRecord) => setLog((prev) => appendRecord(prev, record)),
    [setLog],
  )

  const clear = useCallback(() => setLog([]), [setLog])

  return { log, add, clear }
}
