import { describe, expect, it } from 'vitest'
import { EMPTY_BOARD, applyMove, emptySquares, getResult, isPlayable } from './board'
import type { Board } from '../types/game'

const boardOf = (cells: string) =>
  cells.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O'))) as Board

describe('getResult', () => {
  it('khaali board pe playing deta hai', () => {
    expect(getResult(EMPTY_BOARD).status).toBe('playing')
  })

  it('row, column aur diagonal — teeno detect karta hai', () => {
    expect(getResult(boardOf('XXX...OO.'))).toMatchObject({ winner: 'X' })
    expect(getResult(boardOf('O.XO.XO..'))).toMatchObject({ winner: 'O' })
    expect(getResult(boardOf('X.O.XO..X'))).toMatchObject({ winner: 'X' })
  })

  it('winning line lautata hai', () => {
    const result = getResult(boardOf('XXX...OO.'))
    expect(result.status === 'won' && result.line).toEqual([0, 1, 2])
  })

  it('bhara board bina jeet ke draw hai', () => {
    expect(getResult(boardOf('XXOOOXXOX')).status).toBe('draw')
  })
})

describe('applyMove', () => {
  it('original board mutate nahi karta', () => {
    const before = [...EMPTY_BOARD]
    applyMove(EMPTY_BOARD, 4, 'X')
    expect(EMPTY_BOARD).toEqual(before)
  })
})

describe('isPlayable', () => {
  it('bhari hui aur out-of-range square mana karta hai', () => {
    const board = boardOf('X........')
    expect(isPlayable(board, 0)).toBe(false)
    expect(isPlayable(board, 1)).toBe(true)
    expect(isPlayable(board, 9)).toBe(false)
    expect(isPlayable(board, -1)).toBe(false)
  })

  it('game khatam hone ke baad koi chaal nahi', () => {
    expect(isPlayable(boardOf('XXX...OO.'), 3)).toBe(false)
  })
})

describe('emptySquares', () => {
  it('sirf khaali indexes deta hai', () => {
    expect(emptySquares(boardOf('XX.......'))).toEqual([2, 3, 4, 5, 6, 7, 8])
  })
})
