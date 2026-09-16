# Copilot Instructions — Tic Tac Toe (React + TypeScript + Vite)

These rules steer Copilot's reviews and suggestions for this project.

## What this project actually is

- **React 19 + TypeScript + Vite.** No Tailwind, no UI library.
- **Plain CSS.** Colours and spacing come from CSS variables in
  `src/index.css` (`--accent`, `--text-h`, `--border`, ...). Dark mode runs off
  `prefers-color-scheme`. Flag hardcoded colours and ask for a variable.
- **No API layer.** All state is client-side; the only persistence is
  `localStorage` via `src/lib/storage.ts`.
- `cn()` in `src/lib/cn.ts` joins class names.
- **Board size is 3x3 or 4x4.** Nothing may assume 3. Size comes from the
  board's length (`sizeOf`), and win lines are generated per size by
  `linesFor`. A hardcoded `3`, `9`, or `% 3` in new code is a bug.

## Layers (flag anything that breaks this order)

```
types/  <-  lib/  <-  game/  <-  hooks/  <-  components/  <-  App.tsx
```

- `src/types/game.ts` — every shared type. **Widest blast radius in the repo
  (~19 files).** Review changes here with extra care.
- `src/lib/` — framework-free helpers (`cn`, `storage`, `format`). No React
  imports belong here.
- `src/game/` — **pure logic**: board, minimax AI, history, stats. No React, no
  DOM, no side effects. Every function returns a new object and never mutates
  its input.
- `src/hooks/` — React state. Logic that belongs in `game/` must not be
  duplicated here.
- `src/components/` — presentational. Game rules do not belong in components.

## What to look for in review

- **Blast radius.** When a file in `types/`, `lib/` or `game/` changes, say what
  it affects. The PR already gets an impact report comment with a dependency
  graph — read it.
- **Purity in `src/game/`.** Flag anything that mutates a board, stats or
  history object, or that depends on `Math.random` / `Date` outside the AI's
  difficulty handling. Those make tests flaky.
- **Board size assumptions.** Any new `3`, `9`, `SIZE`-like constant, or
  index maths that only works on a 3x3 grid.
- **AI search cost.** `bestMove` only runs a full minimax when there are few
  enough empty squares; beyond that it is depth-limited. Raising that limit or
  removing alpha-beta pruning will hang a 4x4 game — flag it.
- **Type safety.** Flag `any`. Check that discriminated unions (`Result`,
  `Move`, `Stats`) are handled exhaustively in every `switch`.
- **React.** Missing dependency arrays (`useEffect`, `useMemo`, `useCallback`),
  effect cleanup (timers must be cleared), list keys.
- **Accessibility.** `aria-label` on squares, `aria-pressed` on toggles,
  `role="status"` on the status line, and keyboard navigation
  (`useKeyboardNav`) must keep working.
- **localStorage.** Every access goes through a try/catch — it throws in
  private mode. Keys are per mode and per board size; a key that drops either
  will show the wrong stats.
- **Tests.** If logic in `src/game/` or `src/lib/` changes and no test changes
  with it, ask for one. The runner is vitest and tests sit next to the file as
  `*.test.ts` (56 of them today).

## When suggesting changes

- Follow the patterns already in the neighbouring files.
- CSS variables for colours, never a hardcoded hex.
- Reuse the existing types in `src/types/game.ts` instead of adding new ones.
- Comment only where the "why" is not obvious — the "what" should be readable
  from the code.

## Do not

- Suggest new dependencies without a clear need.
- Suggest large refactors unless they were explicitly asked for.
- Pull game logic into components — it stays in `src/game/`.
