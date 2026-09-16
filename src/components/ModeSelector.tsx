import { cn } from '../lib/cn'
import type { Mode } from '../types/game'

const MODES: { value: Mode; label: string }[] = [
  { value: 'two-player', label: '2 players' },
  { value: 'computer', label: 'vs computer' },
]

type Props = {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="chips" role="group" aria-label="Game mode">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={cn('chip', mode === value && 'chip-active')}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
