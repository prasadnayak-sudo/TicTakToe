import { cn } from '../lib/cn'
import type { Difficulty } from '../types/game'

const LEVELS: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'easy', label: 'Easy', hint: 'Random chaal' },
  { value: 'medium', label: 'Medium', hint: 'Kabhi-kabhi galti' },
  { value: 'hard', label: 'Hard', hint: 'Perfect — jeet nahi sakte' },
]

type Props = {
  difficulty: Difficulty
  onChange: (difficulty: Difficulty) => void
}

export function DifficultySelector({ difficulty, onChange }: Props) {
  return (
    <div className="chips" role="group" aria-label="Difficulty">
      {LEVELS.map(({ value, label, hint }) => (
        <button
          key={value}
          type="button"
          className={cn('chip', difficulty === value && 'chip-active')}
          aria-pressed={difficulty === value}
          title={hint}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
