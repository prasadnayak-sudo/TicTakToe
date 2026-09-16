import { useCallback } from 'react'
import { EMPTY_STATS, recordResult } from '../game/stats'
import { useLocalStorage } from './useLocalStorage'
import type { BoardSize, Mode, Result, Stats } from '../types/game'

/**
 * Har mode aur har board size ke stats alag rakhe jaate hain — 4x4 ki jeet
 * 3x3 ke record mein nahi ginni chahiye.
 */
const storageKey = (mode: Mode, size: BoardSize) => `ttt:stats:${mode}:${size}`

export function useStats(mode: Mode, size: BoardSize) {
  const [stats, setStats] = useLocalStorage<Stats>(
    storageKey(mode, size),
    EMPTY_STATS,
  )

  const record = useCallback(
    (result: Result) => setStats((prev) => recordResult(prev, result)),
    [setStats],
  )

  const reset = useCallback(() => setStats(EMPTY_STATS), [setStats])

  return { stats, record, reset }
}
