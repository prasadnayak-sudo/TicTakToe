/** Conditional class names ko ek string mein jodta hai. */
export function cn(
  ...parts: (string | false | null | undefined)[]
): string {
  return parts.filter(Boolean).join(' ')
}
