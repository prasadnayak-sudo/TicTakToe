import { cn } from '../lib/cn'
import { moveLabel } from '../lib/format'
import type { Move } from '../types/game'

type Props = {
  history: Move[]
  onJump: (step: number) => void
}

export function MoveHistory({ history, onJump }: Props) {
  return (
    <div className="panel">
      <h2>Moves</h2>
      {history.length === 0 ? (
        <p className="muted">Abhi koi chaal nahi chali.</p>
      ) : (
        <ol className="moves">
          {history.map((move, step) => (
            <li key={step}>
              <button
                type="button"
                className={cn('link-button', step === history.length - 1 && 'current')}
                onClick={() => onJump(step + 1)}
              >
                {moveLabel(move, step)}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
