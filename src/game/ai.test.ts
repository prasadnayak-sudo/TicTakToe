import { describe, expect, it } from 'vitest'
import { bestMove, chooseMove, randomMove } from './ai'
import { EMPTY_BOARD, applyMove, emptySquares, getResult, other } from './board'
import type { Board, Difficulty, Player } from '../types/game'

const boardOf = (cells: string) =>
  cells.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O'))) as Board

describe('bestMove', () => {
  it('jeet milti ho to turant le leta hai', () => {
    expect(bestMove(boardOf('OO.XX....'), 'O')).toBe(2)
  })

  it('opponent ki jeet block karta hai', () => {
    expect(bestMove(boardOf('...XX.O..'), 'O')).toBe(5)
  })

  it('bhare board pe null deta hai', () => {
    expect(bestMove(boardOf('XOXXOOOXX'), 'X')).toBeNull()
  })

  it('perfect vs perfect hamesha draw hota hai', () => {
    let board = EMPTY_BOARD
    let turn: Player = 'X'
    while (getResult(board).status === 'playing') {
      const move = bestMove(board, turn)
      expect(move).not.toBeNull()
      board = applyMove(board, move!, turn)
      turn = other(turn)
    }
    expect(getResult(board).status).toBe('draw')
  })

  it('kisi bhi opening ke against kabhi nahi haarta', () => {
    for (const opening of emptySquares(EMPTY_BOARD)) {
      let board = applyMove(EMPTY_BOARD, opening, 'X')
      let turn: Player = 'O'
      while (getResult(board).status === 'playing') {
        // Human ke liye first-available (weak) chaal; AI ko phir bhi nahi haarna chahiye.
        const move = turn === 'O' ? bestMove(board, 'O') : emptySquares(board)[0]
        board = applyMove(board, move!, turn)
        turn = other(turn)
      }
      const result = getResult(board)
      expect(result.status === 'won' && result.winner === 'X').toBe(false)
    }
  })
})

describe('chooseMove', () => {
  const levels: Difficulty[] = ['easy', 'medium', 'hard']

  it('har difficulty pe legal chaal deta hai', () => {
    const board = boardOf('XO.X.....')
    for (const level of levels) {
      for (let i = 0; i < 25; i++) {
        const move = chooseMove(board, 'O', level)
        expect(emptySquares(board)).toContain(move!)
      }
    }
  })

  it('bhare board pe har level null deta hai', () => {
    const full = boardOf('XOXXOOOXX')
    for (const level of levels) {
      expect(chooseMove(full, 'O', level)).toBeNull()
    }
  })

  it('hard hamesha perfect chaal hi khelta hai', () => {
    const board = boardOf('OO.XX....')
    for (let i = 0; i < 10; i++) {
      expect(chooseMove(board, 'O', 'hard')).toBe(2)
    }
  })
})

describe('randomMove', () => {
  it('bhare board pe null', () => {
    expect(randomMove(boardOf('XOXXOOOXX'))).toBeNull()
  })
})
