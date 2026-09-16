import { cn } from '../lib/cn'
import { squareLabel } from '../lib/format'
import type { BoardSize, Square as SquareValue } from '../types/game'

type Props = {
  index: number
  value: SquareValue
  size: BoardSize
  winning: boolean
  disabled: boolean
  onSelect: (index: number) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>, index: number) => void
}

export function Square({
  index,
  value,
  size,
  winning,
  disabled,
  onSelect,
  onKeyDown,
}: Props) {
  return (
    <button
      type="button"
      data-square={index}
      className={cn('square', winning && 'winning', value && 'filled')}
      disabled={disabled}
      aria-label={`${squareLabel(index, size)}: ${value ?? 'khaali'}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      {value}
    </button>
  )
}
