import { useCallback, useMemo } from 'react'
import { EMPTY_STATS, normalizeStats, recordResult } from '../game/stats'
import { useLocalStorage } from './useLocalStorage'
import type { BoardSize, Mode, Result, Stats } from '../types/game'

/**
 * Har mode aur har board size ke stats alag rakhe jaate hain — 4x4 ki jeet
 * 3x3 ke record mein nahi ginni chahiye.
 */
const storageKey = (mode: Mode, size: BoardSize) => `ttt:stats:${mode}:${size}`

export function useStats(mode: Mode, size: BoardSize) {
  const [stored, setStats] = useLocalStorage<Stats>(
    storageKey(mode, size),
    EMPTY_STATS,
  )

  // Storage ka data kisi purane version ka ho sakta hai, isliye use waisa hi
  // bharosa nahi kiya jaata jaisa apne banaye state par.
  const stats = useMemo(() => normalizeStats(stored), [stored])

  // prev seedha storage se aata hai, isliye yahan bhi normalize karna padta
  // hai — warna purane data par pehli jeet hi galat count ho jaati.
  const record = useCallback(
    (result: Result) =>
      setStats((prev) => recordResult(normalizeStats(prev), result)),
    [setStats],
  )

  const reset = useCallback(() => setStats(EMPTY_STATS), [setStats])

  return { stats, record, reset }
}
