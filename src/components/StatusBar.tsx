import { cn } from '../lib/cn'
import type { Mode, Player, Result } from '../types/game'

type Props = {
  result: Result
  turn: Player
  mode: Mode
  computer: Player
}

function statusText(
  result: Result,
  turn: Player,
  mode: Mode,
  computer: Player,
): string {
  if (result.status === 'won') {
    if (mode !== 'computer') return `${result.winner} jeeta!`
    return result.winner === computer ? 'Computer jeeta' : 'Tum jeete!'
  }
  if (result.status === 'draw') return 'Draw raha'
  if (mode === 'computer' && turn === computer) return 'Computer soch raha hai…'
  return `${turn} ki baari`
}

export function StatusBar({ result, turn, mode, computer }: Props) {
  return (
    <p
      className={cn('status', result.status === 'won' && 'status-won')}
      role="status"
    >
      {statusText(result, turn, mode, computer)}
    </p>
  )
}
