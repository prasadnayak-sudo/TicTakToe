import { describe, expect, it } from 'vitest'
import { boardFromHistory, jumpTo, takeBack, turnFromHistory } from './history'
import type { Move } from '../types/game'

const history: Move[] = [
  { index: 4, player: 'X' },
  { index: 0, player: 'O' },
  { index: 8, player: 'X' },
]

describe('boardFromHistory', () => {
  it('chaalon ko replay karke board banata hai', () => {
    const board = boardFromHistory(history, 3)
    expect(board[4]).toBe('X')
    expect(board[0]).toBe('O')
    expect(board[8]).toBe('X')
    expect(board.filter(Boolean)).toHaveLength(3)
  })

  it('khaali history pe khaali board', () => {
    expect(boardFromHistory([], 3).every((s) => s === null)).toBe(true)
  })
})

describe('turnFromHistory', () => {
  it('aakhri chaal ka opposite deta hai', () => {
    expect(turnFromHistory(history, 'X')).toBe('O')
  })

  it('khaali history pe starter hi khelta hai', () => {
    expect(turnFromHistory([], 'O')).toBe('O')
  })
})

describe('takeBack', () => {
  it('2-player mode mein ek ply hatata hai', () => {
    expect(takeBack(history, 'two-player')).toHaveLength(2)
  })

  it('computer mode mein do ply hatata hai, taaki turn human ka hi rahe', () => {
    const result = takeBack(history, 'computer')
    expect(result).toHaveLength(1)
    expect(turnFromHistory(result, 'X')).toBe('O')
  })

  it('khaali history pe khaali hi rehta hai', () => {
    expect(takeBack([], 'computer')).toEqual([])
  })
})

describe('jumpTo', () => {
  it('history ko diye gaye step tak kaatta hai', () => {
    expect(jumpTo(history, 2)).toHaveLength(2)
  })

  it('range ke bahar ke step clamp hote hain', () => {
    expect(jumpTo(history, 99)).toHaveLength(3)
    expect(jumpTo(history, -5)).toHaveLength(0)
  })
})

describe('boardFromHistory — 4x4', () => {
  it('bade board par bhi sahi jagah chaal rakhta hai', () => {
    const board = boardFromHistory([{ index: 15, player: 'O' }], 4)
    expect(board).toHaveLength(16)
    expect(board[15]).toBe('O')
  })
})
