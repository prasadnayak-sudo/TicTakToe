# Tic Tac Toe

A tic tac toe game built with React, TypeScript and Vite.

- **2 players** — hot-seat on one keyboard/mouse, X moves first.
- **vs computer** — you play X against a minimax opponent that plays perfectly, so a draw is the best result you can force.
- Running score per mode, winning line highlighted, light and dark themes.

## Running it

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # type-check + production build
npm run lint
```

## Layout

- [src/ticTacToe.ts](src/ticTacToe.ts) — board types, win/draw detection, and the minimax AI (`bestMove`). No React, so it is easy to test on its own.
- [src/App.tsx](src/App.tsx) — the board UI, turn/score state, and the computer's delayed reply.
- [src/App.css](src/App.css) — game styles, built on the CSS variables in [src/index.css](src/index.css).
