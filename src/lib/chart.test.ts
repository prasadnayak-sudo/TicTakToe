import { describe, expect, it } from 'vitest'
import { bucket, labelFits, percentOf, stack } from './chart'

describe('stack', () => {
  it('values ko 100% mein baantta hai', () => {
    const segments = stack([1, 1, 2])
    expect(segments.map((s) => s.size)).toEqual([25, 25, 50])
  })

  it('segments bina gap ke ek doosre ke baad shuru hote hain', () => {
    const segments = stack([2, 3, 5])
    expect(segments.map((s) => s.start)).toEqual([0, 20, 50])
  })

  it('sab zero hon to khaali stack, NaN nahi', () => {
    const segments = stack([0, 0, 0])
    expect(segments).toEqual([
      { start: 0, size: 0 },
      { start: 0, size: 0 },
      { start: 0, size: 0 },
    ])
  })

  it('khaali input par khaali output', () => {
    expect(stack([])).toEqual([])
  })

  it('negative values ko zero maanta hai, taaki bar ulta na ho', () => {
    const segments = stack([-5, 10])
    expect(segments.map((s) => s.size)).toEqual([0, 100])
  })

  it('poora hissa hamesha 100 hota hai', () => {
    const segments = stack([7, 11, 3])
    const total = segments.reduce((sum, s) => sum + s.size, 0)
    expect(total).toBeCloseTo(100)
  })
})

describe('percentOf', () => {
  it('ratio deta hai', () => {
    expect(percentOf(1, 4)).toBe(25)
  })

  it('total zero par 0 — divide-by-zero nahi', () => {
    expect(percentOf(3, 0)).toBe(0)
  })
})

describe('bucket', () => {
  it('zero hamesha bucket 0 mein rehta hai', () => {
    expect(bucket(0, 10, 5)).toBe(0)
  })

  it('koi bhi non-zero value bucket 0 se upar jaati hai', () => {
    // Warna "ek baar khela" aur "kabhi nahi khela" ek jaise dikhte.
    expect(bucket(1, 100, 5)).toBe(1)
  })

  it('max value sabse upar wale bucket mein jaati hai', () => {
    expect(bucket(10, 10, 5)).toBe(4)
  })

  it('kabhi range ke bahar nahi jaata', () => {
    for (const value of [0, 1, 5, 9, 10, 50]) {
      const step = bucket(value, 10, 5)
      expect(step).toBeGreaterThanOrEqual(0)
      expect(step).toBeLessThanOrEqual(4)
    }
  })

  it('max zero ya negative par 0 deta hai', () => {
    expect(bucket(5, 0, 5)).toBe(0)
    expect(bucket(-2, 10, 5)).toBe(0)
  })
})

describe('labelFits', () => {
  it('chaude segment mein label fit hota hai', () => {
    expect(labelFits(50, 400, 3)).toBe(true)
  })

  it('patle segment mein nahi — clip karne se behtar hai label na ho', () => {
    expect(labelFits(5, 400, 8)).toBe(false)
  })
})
