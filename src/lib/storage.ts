/**
 * localStorage wrapper. Private mode / blocked storage mein throw kar sakta
 * hai, isliye har call guarded hai — app kabhi crash nahi hona chahiye.
 */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage bhara hua ya blocked hai — chup-chaap chhod do.
  }
}
