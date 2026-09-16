import { useCallback, useState } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'

/**
 * useState jaisa, par value localStorage mein bhi likhta hai.
 *
 * Key badal sakti hai (jaise mode/size ke hisaab se alag stats). Aise mein
 * value ko turant nayi key se dobara padhna padta hai — warna user ko purani
 * key ka data dikhta rehta hai.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState(() => ({ key, value: loadJSON(key, initial) }))

  // Render ke dauraan state set karna is derived-state case ke liye sahi hai:
  // React turant dobara render karta hai, purani value kabhi paint nahi hoti.
  if (state.key !== key) {
    setState({ key, value: loadJSON(key, initial) })
  }

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev.value) : next
        saveJSON(prev.key, resolved)
        return { key: prev.key, value: resolved }
      })
    },
    [],
  )

  return [state.value, update] as const
}
