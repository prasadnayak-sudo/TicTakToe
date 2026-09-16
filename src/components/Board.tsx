import { Square } from './Square'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import type { Board as BoardValue, Result } from '../types/game'

type Props = {
  board: BoardValue
  result: Result
  locked: boolean
  onSelect: (index: number) => void
}

export function Board({ board, result, locked, onSelect }: Props) {
  const { onKeyDown } = useKeyboardNav(onSelect)

  return (
    <div className="board" role="grid" aria-label="Tic tac toe board">
      {board.map((value, index) => (
        <Square
          key={index}
          index={index}
          value={value}
          winning={result.status === 'won' && result.line.includes(index)}
          disabled={!!value || locked || result.status !== 'playing'}
          onSelect={onSelect}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  )
}
