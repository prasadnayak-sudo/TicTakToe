import { cn } from '../lib/cn'
import { squareLabel } from '../lib/format'
import type { Square as SquareValue } from '../types/game'

type Props = {
  index: number
  value: SquareValue
  winning: boolean
  disabled: boolean
  onSelect: (index: number) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>, index: number) => void
}

export function Square({
  index,
  value,
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
      aria-label={`${squareLabel(index)}: ${value ?? 'khaali'}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      {value}
    </button>
  )
}
