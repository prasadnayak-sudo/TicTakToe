import { useCallback, useEffect, useState } from 'react'
import {
  bestMove,
  EMPTY_BOARD,
  getResult,
  type Board,
  type Player,
} from './ticTacToe'
import './App.css'

type Mode = 'two-player' | 'computer'
type Scores = Record<Player | 'draws', number>

const EMPTY_SCORES: Scores = { X: 0, O: 0, draws: 0 }
const HUMAN: Player = 'X'
const COMPUTER: Player = 'O'

function App() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD)
  const [turn, setTurn] = useState<Player>('X')
  const [mode, setMode] = useState<Mode>('two-player')
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES)

  const result = getResult(board)
  const over = result.status !== 'playing'
  const computerTurn = mode === 'computer' && turn === COMPUTER && !over

  const play = useCallback(
    (index: number) => {
      if (board[index] || getResult(board).status !== 'playing') return

      const next = [...board]
      next[index] = turn
      const nextResult = getResult(next)

      if (nextResult.status === 'won') {
        setScores((s) => ({
          ...s,
          [nextResult.winner]: s[nextResult.winner] + 1,
        }))
      } else if (nextResult.status === 'draw') {
        setScores((s) => ({ ...s, draws: s.draws + 1 }))
      }

      setBoard(next)
      setTurn(turn === 'X' ? 'O' : 'X')
    },
    [board, turn],
  )

  // Let the move land visibly before the computer answers it.
  useEffect(() => {
    if (!computerTurn) return
    const timer = setTimeout(() => {
      const move = bestMove(board, COMPUTER)
      if (move !== null) play(move)
    }, 350)
    return () => clearTimeout(timer)
  }, [computerTurn, board, play])

  function newRound() {
    setBoard(EMPTY_BOARD)
    setTurn('X')
  }

  function switchMode(next: Mode) {
    setMode(next)
    setScores(EMPTY_SCORES)
    newRound()
  }

  const status =
    result.status === 'won'
      ? mode === 'computer'
        ? result.winner === HUMAN
          ? 'You win!'
          : 'Computer wins'
        : `${result.winner} wins!`
      : result.status === 'draw'
        ? "It's a draw"
        : mode === 'computer' && turn === COMPUTER
          ? 'Computer thinking…'
          : `${turn}'s turn`

  return (
    <>
      <section id="center">
        <div>
          <h1>Tic Tac Toe</h1>
          <div className="modes" role="group" aria-label="Game mode">
            <button
              type="button"
              className="mode"
              aria-pressed={mode === 'two-player'}
              onClick={() => switchMode('two-player')}
            >
              2 players
            </button>
            <button
              type="button"
              className="mode"
              aria-pressed={mode === 'computer'}
              onClick={() => switchMode('computer')}
            >
              vs computer
            </button>
          </div>
        </div>

        <p className="status" role="status">
          {status}
        </p>

        <div className="board">
          {board.map((square, i) => (
            <button
              key={i}
              type="button"
              className={`square${
                result.status === 'won' && result.line.includes(i)
                  ? ' winning'
                  : ''
              }`}
              disabled={!!square || over || computerTurn}
              aria-label={square ? `Square ${i + 1}: ${square}` : `Square ${i + 1}: empty`}
              onClick={() => play(i)}
            >
              {square}
            </button>
          ))}
        </div>

        <button type="button" className="counter" onClick={newRound}>
          {over ? 'Play again' : 'Reset board'}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Score</h2>
          <p>{mode === 'computer' ? 'You vs the computer' : 'Best of as many as you like'}</p>
          <ul className="scores">
            <li>
              <span className="score-label">{mode === 'computer' ? 'You (X)' : 'X'}</span>
              <span className="score-value">{scores.X}</span>
            </li>
            <li>
              <span className="score-label">{mode === 'computer' ? 'Computer (O)' : 'O'}</span>
              <span className="score-value">{scores.O}</span>
            </li>
            <li>
              <span className="score-label">Draws</span>
              <span className="score-value">{scores.draws}</span>
            </li>
          </ul>
        </div>
        <div id="social">
          <h2>How to play</h2>
          <p>Get three in a row — across, down, or diagonally.</p>
          <ul className="rules">
            <li>X always moves first.</li>
            <li>In <strong>vs computer</strong>, you play X against a perfect opponent — a draw is the best you can force.</li>
            <li>Scores reset when you change mode.</li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
