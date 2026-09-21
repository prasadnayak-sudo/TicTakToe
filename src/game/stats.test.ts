import { describe, expect, it } from 'vitest'
import {
  EMPTY_STATS,
  normalizeStats,
  recordResult,
  totalGames,
  winRate,
} from './stats'
import type { Result, Stats } from '../types/game'

const won = (winner: 'X' | 'O'): Result => ({
  status: 'won',
  winner,
  line: [0, 1, 2],
})
const draw: Result = { status: 'draw' }

const record = (results: Result[]): Stats =>
  results.reduce(recordResult, EMPTY_STATS)

describe('recordResult', () => {
  it('jeet aur draw dono count karta hai', () => {
    const stats = record([won('X'), won('O'), draw])
    expect(stats).toMatchObject({ X: 1, O: 1, draws: 1 })
  })

  it('lagatar jeet pe streak badhti hai', () => {
    const stats = record([won('X'), won('X'), won('X')])
    expect(stats.currentStreak).toEqual({ player: 'X', length: 3 })
    expect(stats.bestStreak).toBe(3)
    expect(stats.bestStreakBy).toBe('X')
  })

  it('doosra player jeete to streak reset hoti hai', () => {
    const stats = record([won('X'), won('X'), won('O')])
    expect(stats.currentStreak).toEqual({ player: 'O', length: 1 })
    expect(stats.bestStreak).toBe(2)
    expect(stats.bestStreakBy).toBe('X')
  })

  it('draw current streak todta hai par best rakhta hai', () => {
    const stats = record([won('X'), won('X'), draw])
    expect(stats.currentStreak).toBeNull()
    expect(stats.bestStreak).toBe(2)
    expect(stats.bestStreakBy).toBe('X')
  })

  it('record tootne par best streak ka maalik badal jaata hai', () => {
    const stats = record([won('X'), won('X'), won('O'), won('O'), won('O')])
    expect(stats.bestStreak).toBe(3)
    expect(stats.bestStreakBy).toBe('O')
  })

  it('barabari par purana record rakhne wala hi maalik rehta hai', () => {
    const stats = record([won('X'), won('X'), won('O'), won('O')])
    expect(stats.bestStreak).toBe(2)
    expect(stats.bestStreakBy).toBe('X')
  })

  it('chalu game ko count nahi karta', () => {
    expect(recordResult(EMPTY_STATS, { status: 'playing' })).toEqual(EMPTY_STATS)
  })

  it('input stats mutate nahi karta', () => {
    const before = { ...EMPTY_STATS }
    recordResult(EMPTY_STATS, won('X'))
    expect(EMPTY_STATS).toEqual(before)
  })
})

describe('normalizeStats', () => {
  it('purane saved data ko bina bestStreakBy ke bhi padh leta hai', () => {
    const legacy = { X: 3, O: 1, draws: 2, currentStreak: null, bestStreak: 2 }
    expect(normalizeStats(legacy)).toEqual({
      X: 3,
      O: 1,
      draws: 2,
      currentStreak: null,
      bestStreak: 2,
      // Us waqt player record hota hi nahi tha, isliye guess nahi karte.
      bestStreakBy: null,
    })
  })

  it('poore data ko waisa hi rakhta hai', () => {
    const stats = record([won('X'), won('X')])
    expect(normalizeStats(stats)).toEqual(stats)
  })

  it('kachre ko EMPTY_STATS bana deta hai', () => {
    expect(normalizeStats(null)).toEqual(EMPTY_STATS)
    expect(normalizeStats('nonsense')).toEqual(EMPTY_STATS)
    expect(normalizeStats({})).toEqual(EMPTY_STATS)
  })

  it('kharab counts ko 0 par le aata hai', () => {
    const broken = { X: -5, O: 'two', draws: NaN, bestStreak: 1.9 }
    expect(normalizeStats(broken)).toMatchObject({ X: 0, O: 0, draws: 0, bestStreak: 1 })
  })

  it('adhoori streak ko null karta hai', () => {
    expect(normalizeStats({ currentStreak: { player: 'Z', length: 3 } }).currentStreak).toBeNull()
    expect(normalizeStats({ currentStreak: { player: 'X' } }).currentStreak).toBeNull()
  })

  it('bestStreak 0 ho to maalik bhi null hona chahiye', () => {
    expect(normalizeStats({ bestStreak: 0, bestStreakBy: 'X' }).bestStreakBy).toBeNull()
  })
})

describe('winRate', () => {
  it('bina game ke 0 deta hai (divide-by-zero nahi)', () => {
    expect(winRate(EMPTY_STATS, 'X')).toBe(0)
    expect(totalGames(EMPTY_STATS)).toBe(0)
  })

  it('kul games ke hisaab se ratio deta hai', () => {
    const stats = record([won('X'), won('X'), won('O'), draw])
    expect(winRate(stats, 'X')).toBe(0.5)
    expect(totalGames(stats)).toBe(4)
  })
})
