# Copilot Instructions — Tic Tac Toe (React + TypeScript + Vite)

Ye rules Copilot review aur suggestions ko is project ke hisaab se guide karte hain.

## Project ka asli shape

- **React 19 + TypeScript + Vite.** Koi Tailwind nahi, koi UI library nahi.
- **Styling** plain CSS hai. Colors/spacing `src/index.css` ke CSS variables se
  aate hain (`--accent`, `--text-h`, `--border`, ...). Dark mode `prefers-color-scheme`
  se chalta hai — hardcoded color flag karo, variable use karwao.
- **Koi API layer nahi.** Saara state client-side hai; persistence sirf
  `localStorage` (`src/lib/storage.ts`) se hoti hai.
- Class names jodne ke liye `cn()` helper hai (`src/lib/cn.ts`).

## Layers (ye order tod-na review mein flag karo)

```
types/  <-  lib/  <-  game/  <-  hooks/  <-  components/  <-  App.tsx
```

- `src/types/game.ts` — saare shared types. **Sabse bada blast radius** (18+ files).
  Isme koi bhi change ho to review extra dhyaan se ho.
- `src/lib/` — framework-free helpers (`cn`, `storage`, `format`). React import
  yahan nahi aana chahiye.
- `src/game/` — **pure logic**: board, minimax AI, history, stats. Koi React,
  koi DOM, koi side effect nahi. Har function naya object lautaye, input mutate na kare.
- `src/hooks/` — React state. `game/` ki logic yahan duplicate na ho.
- `src/components/` — presentational. Game rules components mein na likhe jaayein.

## Review karte waqt ye dekho

- **Blast radius** — `types/`, `lib/` ya `game/` ki koi file badli ho to batao
  kaun-kaun affected hai (PR pe impact report comment already aata hai).
- **Pure logic mein purity** — `src/game/` ka koi function board/stats/history
  mutate kare, ya `Math.random`/`Date` pe depend kare (AI difficulty ke alawa),
  to flag karo — wo test ko flaky banata hai.
- **Type safety** — `any` flag karo. Result/Move/Stats jaise discriminated
  unions pe exhaustive handling check karo (switch mein saare cases).
- **React** — missing dependency arrays (`useEffect`, `useMemo`, `useCallback`),
  effect cleanup (timers zaroor clear hone chahiye), list keys.
- **Accessibility** — squares pe `aria-label`, toggles pe `aria-pressed`,
  status pe `role="status"`, keyboard navigation (`useKeyboardNav`) na tootey.
- **localStorage** — har access try/catch mein ho (private mode mein throw karta hai).
- **Tests** — `src/game/` ya `src/lib/` ki logic badle aur uska test na badle,
  to test maango. Runner vitest hai, tests file ke saath `*.test.ts` mein rehte hain.

## Suggestion dete waqt

- Existing patterns follow karo (dekho paas ki files kaise likhi gayi hain).
- Colors ke liye CSS variables, hardcoded hex nahi.
- Naye types banane ki jagah `src/types/game.ts` ke existing types reuse karo.
- Comments sirf wahan jahan "kyun" samajhna zaroori ho — "kya" ho raha hai wo code se dikhna chahiye.

## Kya na karo

- Bina zaroorat naye dependencies mat suggest karo.
- Bade refactor tab tak mat suggest karo jab tak explicitly na maanga jaaye.
- Game logic ko components mein mat kheencho — wo `src/game/` mein hi rahegi.
