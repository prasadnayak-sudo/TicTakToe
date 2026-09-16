import { useCallback, useState } from 'react'
import { SIZE, SQUARES } from '../game/board'

const DELTA: Record<string, number> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: SIZE,
  ArrowUp: -SIZE,
}

/** Arrow keys se board par focus ghumata hai (grid ke kinare pe rukta hai). */
export function useKeyboardNav(onSelect: (index: number) => void) {
  const [focused, setFocused] = useState(0)

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, index: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(index)
        return
      }

      const delta = DELTA[event.key]
      if (delta === undefined) return

      // Horizontal move row ke andar hi rehna chahiye.
      const horizontal = Math.abs(delta) === 1
      const next = index + delta
      if (next < 0 || next >= SQUARES) return
      if (horizontal && Math.floor(next / SIZE) !== Math.floor(index / SIZE)) return

      event.preventDefault()
      setFocused(next)
      const target = document.querySelector<HTMLButtonElement>(
        `[data-square="${next}"]`,
      )
      target?.focus()
    },
    [onSelect],
  )

  return { focused, onKeyDown }
}
