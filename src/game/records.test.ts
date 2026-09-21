import { describe, expect, it } from 'vitest'
import {
  RECORD_LIMIT,
  appendRecord,
  averageMoves,
  openingCounts,
  outcomeCounts,
  toRecord,
} from './records'
import { emptyBoard } from './board'
import type { GameRecord, Move, Result } from '../types/game'

const record = (over: Partial<GameRecord> = {}): GameRecord => ({
  winner: 'X',
  mode: 'two-player',
  size: 3,
  moves: 5,
  opening: 4,
  at: 0,
  ...over,
})

const history = (indexes: number[]): Move[] =>
  indexes.map((index, i) => ({ index, player: i % 2 === 0 ? 'X' : 'O' }))

describe('toRecord', () => {
  const won: Result = { status: 'won', winner: 'X', line: [0, 1, 2] }

  it('jeet ko winner ke saath record karta hai', () => {
    const result = toRecord(won, { mode: 'computer', board: emptyBoard(3), history: history([4, 0]) }, 123)
    expect(result).toMatchObject({ winner: 'X', mode: 'computer', size: 3, moves: 2, opening: 4, at: 123 })
  })

  it('draw ka winner null hota hai', () => {
    const result = toRecord({ status: 'draw' }, { mode: 'two-player', board: emptyBoard(3), history: [] }, 0)
    expect(result?.winner).toBeNull()
  })

  it('chalu game par null — caller ko check nahi karna padta', () => {
    const result = toRecord({ status: 'playing' }, { mode: 'two-player', board: emptyBoard(3), history: [] }, 0)
    expect(result).toBeNull()
  })

  it('size board se leta hai, isliye 4x4 sahi record hota hai', () => {
    const result = toRecord(won, { mode: 'two-player', board: emptyBoard(4), history: history([15]) }, 0)
    expect(result?.size).toBe(4)
  })

  it('bina chaal wale round ka opening null hota hai', () => {
    const result = toRecord({ status: 'draw' }, { mode: 'two-player', board: emptyBoard(3), history: [] }, 0)
    expect(result?.opening).toBeNull()
  })
})

describe('appendRecord', () => {
  it('naya record aakhir mein jodta hai', () => {
    const log = appendRecord([record({ at: 1 })], record({ at: 2 }))
    expect(log.map((r) => r.at)).toEqual([1, 2])
  })

  it('input log mutate nahi karta', () => {
    const original = [record({ at: 1 })]
    appendRecord(original, record({ at: 2 }))
    expect(original).toHaveLength(1)
  })

  it('limit par purane records girte hain, naye bachte hain', () => {
    let log: GameRecord[] = []
    for (let i = 0; i < RECORD_LIMIT + 10; i++) log = appendRecord(log, record({ at: i }))

    expect(log).toHaveLength(RECORD_LIMIT)
    expect(log[log.length - 1].at).toBe(RECORD_LIMIT + 9)
    expect(log[0].at).toBe(10)
  })
})

describe('outcomeCounts', () => {
  it('jeet aur draw alag-alag ginta hai', () => {
    const counts = outcomeCounts([
      record({ winner: 'X' }),
      record({ winner: 'O' }),
      record({ winner: null }),
      record({ winner: 'X' }),
    ])
    expect(counts).toEqual({ X: 2, O: 1, draws: 1 })
  })

  it('khaali log par sab zero', () => {
    expect(outcomeCounts([])).toEqual({ X: 0, O: 0, draws: 0 })
  })
})

describe('openingCounts', () => {
  it('har square ki ginti deta hai', () => {
    const counts = openingCounts([record({ opening: 0 }), record({ opening: 4 }), record({ opening: 4 })], 3)
    expect(counts).toHaveLength(9)
    expect(counts[0]).toBe(1)
    expect(counts[4]).toBe(2)
  })

  it('doosre size ke games ginta hi nahi', () => {
    // 4x4 ka square 15, 3x3 ke grid mein exist hi nahi karta.
    const counts = openingCounts([record({ size: 4, opening: 15 }), record({ size: 3, opening: 1 })], 3)
    expect(counts.reduce((a, b) => a + b, 0)).toBe(1)
    expect(counts[1]).toBe(1)
  })

  it('4x4 par 16 cells lautata hai', () => {
    expect(openingCounts([record({ size: 4, opening: 15 })], 4)).toHaveLength(16)
  })

  it('null aur range ke bahar wale openings chhod deta hai', () => {
    const counts = openingCounts([record({ opening: null }), record({ opening: 99 }), record({ opening: -1 })], 3)
    expect(counts.reduce((a, b) => a + b, 0)).toBe(0)
  })
})

describe('averageMoves', () => {
  it('average deta hai', () => {
    expect(averageMoves([record({ moves: 5 }), record({ moves: 9 })])).toBe(7)
  })

  it('khaali log par 0 — divide-by-zero nahi', () => {
    expect(averageMoves([])).toBe(0)
  })
})
