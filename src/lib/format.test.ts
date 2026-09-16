import { describe, expect, it } from 'vitest'
import { moveLabel, percent, playerLabel, squareLabel } from './format'

describe('squareLabel', () => {
  it('index ko row/column mein badalta hai', () => {
    expect(squareLabel(0)).toBe('r1c1')
    expect(squareLabel(4)).toBe('r2c2')
    expect(squareLabel(8)).toBe('r3c3')
  })
})

describe('moveLabel', () => {
  it('step number 1 se shuru hota hai', () => {
    expect(moveLabel({ index: 4, player: 'X' }, 0)).toBe('1. X → r2c2')
  })
})

describe('percent', () => {
  it('round karke percent deta hai', () => {
    expect(percent(0)).toBe('0%')
    expect(percent(0.5)).toBe('50%')
    expect(percent(1 / 3)).toBe('33%')
  })
})

describe('playerLabel', () => {
  it('computer hone pe alag label deta hai', () => {
    expect(playerLabel('O', true)).toBe('Computer (O)')
    expect(playerLabel('X', false)).toBe('X')
  })
})
