import { describe, expect, it } from 'vitest'
import { bestMove, chooseMove, randomMove } from './ai'
import { applyMove, emptyBoard, emptySquares, getResult, other } from './board'
import type { Board, Difficulty, Player } from '../types/game'

const boardOf = (cells: string) =>
  cells.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O'))) as Board

describe('bestMove — 3x3', () => {
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
    let board = emptyBoard(3)
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
    for (const opening of emptySquares(emptyBoard(3))) {
      let board = applyMove(emptyBoard(3), opening, 'X')
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

describe('bestMove — 4x4 (depth-limited search)', () => {
  it('jeet milti ho to le leta hai', () => {
    // O ki teen ek row mein, chautha khaali.
    expect(bestMove(boardOf('OOO.XXX.........'), 'O')).toBe(3)
  })

  it('opponent ki turant jeet block karta hai', () => {
    expect(bestMove(boardOf('XXX.O...O.......'), 'O')).toBe(3)
  })

  it('khaali 4x4 par bhi waqt pe legal chaal deta hai', () => {
    const started = Date.now()
    const move = bestMove(emptyBoard(4), 'X')
    expect(emptySquares(emptyBoard(4))).toContain(move!)
    // Full search 16 squares par kabhi khatam nahi hota — depth cap lagna zaroori hai.
    expect(Date.now() - started).toBeLessThan(5000)
  })

  it('bhare 4x4 board pe null', () => {
    expect(bestMove(boardOf('XXOOOOXXXXOOOOXX'), 'X')).toBeNull()
  })

  it('poora game bina crash ke khatam hota hai', () => {
    let board = emptyBoard(4)
    let turn: Player = 'X'
    while (getResult(board).status === 'playing') {
      const move = bestMove(board, turn)
      expect(move).not.toBeNull()
      board = applyMove(board, move!, turn)
      turn = other(turn)
    }
    expect(['won', 'draw']).toContain(getResult(board).status)
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

  it('4x4 par bhi har difficulty legal chaal deti hai', () => {
    const board = applyMove(emptyBoard(4), 5, 'X')
    for (const level of levels) {
      const move = chooseMove(board, 'O', level)
      expect(emptySquares(board)).toContain(move!)
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
