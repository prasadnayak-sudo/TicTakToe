# Copilot Instructions — React + TypeScript project

Ye rules Copilot review aur suggestions ko is project ke hisaab se guide karte hain.

## Project
- React + TypeScript
- Tailwind CSS (shared `cn()` utility `src/lib/utils.ts` mein)
- Component-based structure

## Review karte waqt ye dekho
- **Shared files** (jaise `src/lib/utils.ts`, common hooks, shared components) change ho to blast radius zaroor batao — inhe bahut saari files import karti hain.
- **Type safety** — `any` ka use flag karo, missing/galat types batao.
- **React** — unnecessary re-renders, missing dependency arrays (`useEffect`, `useMemo`, `useCallback`), keys missing in lists.
- **API calls** — error handling / loading state missing ho to flag karo.
- **Imports** — unused imports, galat relative paths.
- **Prop drilling** jyada ho to batao.

## Suggestion dete waqt
- Existing patterns follow karo (jaise components kaise likhe gaye hain).
- Tailwind classes ke liye `cn()` use karo, inline conditional strings nahi.
- Naye types banane ki jagah existing types reuse karo jahan ho sakta hai.

## Kya na karo
- Bina zaroorat naye dependencies mat suggest karo.
- Bade refactor tab tak mat suggest karo jab tak explicitly na maanga jaaye.
