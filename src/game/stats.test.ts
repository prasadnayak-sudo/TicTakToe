import { describe, expect, it } from 'vitest'
import { EMPTY_STATS, recordResult, totalGames, winRate } from './stats'
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
  })

  it('doosra player jeete to streak reset hoti hai', () => {
    const stats = record([won('X'), won('X'), won('O')])
    expect(stats.currentStreak).toEqual({ player: 'O', length: 1 })
    expect(stats.bestStreak).toBe(2)
  })

  it('draw current streak todta hai par best rakhta hai', () => {
    const stats = record([won('X'), won('X'), draw])
    expect(stats.currentStreak).toBeNull()
    expect(stats.bestStreak).toBe(2)
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
