/**
 * Chart ke liye pure maths. Koi React, koi DOM — isliye ye seedha test hota hai
 * aur do alag charts ek hi logic share karte hain.
 */

export type Segment = {
  /** 0-100, stack ki shuruaat. */
  start: number
  /** 0-100, segment ki chaudai. */
  size: number
}

/** Values ko 100% ke stack mein badalta hai. Sab zero ho to khaali stack. */
export function stack(values: number[]): Segment[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0)
  if (total === 0) return values.map(() => ({ start: 0, size: 0 }))

  let cursor = 0
  return values.map((value) => {
    const size = (Math.max(0, value) / total) * 100
    const segment = { start: cursor, size }
    cursor += size
    return segment
  })
}

export function percentOf(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100
}

/**
 * Value ko 0..buckets-1 mein daalta hai — heatmap ke discrete colour steps ke liye.
 * Zero hamesha bucket 0 mein rehta hai, taaki "kuch nahi hua" surface ke paas dikhe.
 */
export function bucket(value: number, max: number, buckets: number): number {
  if (buckets < 1) return 0
  if (value <= 0 || max <= 0) return 0
  const index = Math.ceil((value / max) * (buckets - 1))
  return Math.min(buckets - 1, Math.max(1, index))
}

/**
 * Label tabhi andar likho jab wo aaram se fit ho. Warna clip hota hai, jo
 * bina label ke bhi bura hai.
 */
export function labelFits(
  segmentPercent: number,
  chartWidth: number,
  labelChars: number,
): boolean {
  const CHAR_WIDTH = 7
  const PADDING = 16
  return (segmentPercent / 100) * chartWidth >= labelChars * CHAR_WIDTH + PADDING
}
