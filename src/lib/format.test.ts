import { describe, expect, it } from 'vitest'
import { moveLabel, percent, playerLabel, sizeLabel, squareLabel } from './format'

describe('squareLabel', () => {
  it('index ko row/column mein badalta hai', () => {
    expect(squareLabel(0, 3)).toBe('r1c1')
    expect(squareLabel(4, 3)).toBe('r2c2')
    expect(squareLabel(8, 3)).toBe('r3c3')
  })
})

describe('moveLabel', () => {
  it('step number 1 se shuru hota hai', () => {
    expect(moveLabel({ index: 4, player: 'X' }, 0, 3)).toBe('1. X → r2c2')
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

describe('squareLabel — 4x4', () => {
  it('coordinates size ke hisaab se badalte hain', () => {
    // Index 4: 3x3 par center, 4x4 par doosri row ka pehla square.
    expect(squareLabel(4, 3)).toBe('r2c2')
    expect(squareLabel(4, 4)).toBe('r2c1')
    expect(squareLabel(15, 4)).toBe('r4c4')
  })
})

describe('sizeLabel', () => {
  it('padhne layak label deta hai', () => {
    expect(sizeLabel(3)).toBe('3×3')
    expect(sizeLabel(4)).toBe('4×4')
  })
})
