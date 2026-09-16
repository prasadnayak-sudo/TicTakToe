import { SIZES } from '../game/board'
import { cn } from '../lib/cn'
import { sizeLabel } from '../lib/format'
import type { BoardSize } from '../types/game'

type Props = {
  size: BoardSize
  onChange: (size: BoardSize) => void
}

export function BoardSizeSelector({ size, onChange }: Props) {
  return (
    <div className="chips" role="group" aria-label="Board size">
      {SIZES.map((value) => (
        <button
          key={value}
          type="button"
          className={cn('chip', size === value && 'chip-active')}
          aria-pressed={size === value}
          onClick={() => onChange(value)}
        >
          {sizeLabel(value)}
        </button>
      ))}
    </div>
  )
}
