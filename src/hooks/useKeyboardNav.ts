import { useCallback, useState } from 'react'
import type { BoardSize } from '../types/game'

/** Arrow keys se board par focus ghumata hai (grid ke kinare pe rukta hai). */
export function useKeyboardNav(size: BoardSize, onSelect: (index: number) => void) {
  const [focused, setFocused] = useState(0)

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, index: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(index)
        return
      }

      const deltas: Record<string, number> = {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowDown: size,
        ArrowUp: -size,
      }

      const delta = deltas[event.key]
      if (delta === undefined) return

      const next = index + delta
      if (next < 0 || next >= size * size) return

      // Horizontal move row ke andar hi rehna chahiye.
      const horizontal = Math.abs(delta) === 1
      if (horizontal && Math.floor(next / size) !== Math.floor(index / size)) return

      event.preventDefault()
      setFocused(next)
      document.querySelector<HTMLButtonElement>(`[data-square="${next}"]`)?.focus()
    },
    [size, onSelect],
  )

  return { focused, onKeyDown }
}
