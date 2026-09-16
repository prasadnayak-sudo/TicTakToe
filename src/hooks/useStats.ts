import { useCallback } from 'react'
import { EMPTY_STATS, recordResult } from '../game/stats'
import { useLocalStorage } from './useLocalStorage'
import type { Mode, Result, Stats } from '../types/game'

/** Har mode ke stats alag rakhe jaate hain, warna AI ki jeet 2-player score kharab karti. */
const storageKey = (mode: Mode) => `ttt:stats:${mode}`

export function useStats(mode: Mode) {
  const [stats, setStats] = useLocalStorage<Stats>(storageKey(mode), EMPTY_STATS)

  const record = useCallback(
    (result: Result) => setStats((prev) => recordResult(prev, result)),
    [setStats],
  )

  const reset = useCallback(() => setStats(EMPTY_STATS), [setStats])

  return { stats, record, reset }
}
