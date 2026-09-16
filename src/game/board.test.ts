import { describe, expect, it } from 'vitest'
import {
  applyMove,
  emptyBoard,
  emptySquares,
  getResult,
  isPlayable,
  linesFor,
  sizeOf,
} from './board'
import type { Board } from '../types/game'

const boardOf = (cells: string) =>
  cells.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O'))) as Board

describe('linesFor', () => {
  it('3x3 par 8 lines banti hain (3 row + 3 col + 2 diagonal)', () => {
    expect(linesFor(3)).toHaveLength(8)
  })

  it('4x4 par 10 lines banti hain', () => {
    expect(linesFor(4)).toHaveLength(10)
  })

  it('har line ki lambai board ke size jitni hoti hai', () => {
    for (const line of linesFor(4)) expect(line).toHaveLength(4)
  })

  it('dobara maangne par wahi cached array milta hai', () => {
    expect(linesFor(3)).toBe(linesFor(3))
  })
})

describe('sizeOf', () => {
  it('board ki length se size nikaalta hai', () => {
    expect(sizeOf(emptyBoard(3))).toBe(3)
    expect(sizeOf(emptyBoard(4))).toBe(4)
  })
})

describe('getResult — 3x3', () => {
  it('khaali board pe playing deta hai', () => {
    expect(getResult(emptyBoard(3)).status).toBe('playing')
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

describe('getResult — 4x4', () => {
  it('poori row par hi jeet hoti hai, teen par nahi', () => {
    expect(getResult(boardOf('XXX.............')).status).toBe('playing')
    expect(getResult(boardOf('XXXX............'))).toMatchObject({ winner: 'X' })
  })

  it('column aur dono diagonal detect hote hain', () => {
    expect(getResult(boardOf('O...O...O...O...'))).toMatchObject({ winner: 'O' })
    expect(getResult(boardOf('X....X....X....X'))).toMatchObject({ winner: 'X' })
    expect(getResult(boardOf('...O..O..O..O...'))).toMatchObject({ winner: 'O' })
  })

  it('bhara board bina jeet ke draw hai', () => {
    expect(getResult(boardOf('XXOOOOXXXXOOOOXX')).status).toBe('draw')
  })
})

describe('applyMove', () => {
  it('original board mutate nahi karta', () => {
    const board = emptyBoard(3)
    const before = [...board]
    applyMove(board, 4, 'X')
    expect(board).toEqual(before)
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

  it('4x4 par range board ke hisaab se badalti hai', () => {
    expect(isPlayable(emptyBoard(4), 15)).toBe(true)
    expect(isPlayable(emptyBoard(4), 16)).toBe(false)
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
