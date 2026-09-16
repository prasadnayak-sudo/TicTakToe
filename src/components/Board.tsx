import { Square } from './Square'
import { sizeOf } from '../game/board'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import type { Board as BoardValue, Result } from '../types/game'

type Props = {
  board: BoardValue
  result: Result
  locked: boolean
  onSelect: (index: number) => void
}

export function Board({ board, result, locked, onSelect }: Props) {
  const size = sizeOf(board)
  const { onKeyDown } = useKeyboardNav(size, onSelect)

  return (
    <div
      className="board"
      role="grid"
      aria-label={`${size} by ${size} tic tac toe board`}
      // Grid ki columns size ke saath badalti hain, isliye CSS variable se.
      style={{ '--board-size': size } as React.CSSProperties}
    >
      {board.map((value, index) => (
        <Square
          key={index}
          index={index}
          value={value}
          size={size}
          winning={result.status === 'won' && result.line.includes(index)}
          disabled={!!value || locked || result.status !== 'playing'}
          onSelect={onSelect}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  )
}
