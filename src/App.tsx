import { useEffect, useRef } from 'react'
import { Board } from './components/Board'
import { DifficultySelector } from './components/DifficultySelector'
import { GameControls } from './components/GameControls'
import { ModeSelector } from './components/ModeSelector'
import { MoveHistory } from './components/MoveHistory'
import { ScoreBoard } from './components/ScoreBoard'
import { StatusBar } from './components/StatusBar'
import { other } from './game/board'
import { useComputerOpponent } from './hooks/useComputerOpponent'
import { useGame } from './hooks/useGame'
import { useStats } from './hooks/useStats'
import './App.css'

function App() {
  const game = useGame()
  const { stats, record, reset } = useStats(game.mode)

  // Computer hamesha starter ka opposite khelta hai.
  const computer = other(game.starter)
  const over = game.result.status !== 'playing'
  const computerTurn = game.mode === 'computer' && game.turn === computer && !over

  useComputerOpponent({
    board: game.board,
    player: computer,
    difficulty: game.difficulty,
    active: computerTurn,
    onMove: game.play,
  })

  // Ek round ka result sirf ek baar count hona chahiye, warna undo/jump se
  // score dobara badh jayega.
  const counted = useRef(false)
  useEffect(() => {
    if (!over) {
      counted.current = false
      return
    }
    if (counted.current) return
    counted.current = true
    record(game.result)
  }, [over, game.result, record])

  return (
    <>
      <section id="center">
        <div>
          <h1>Tic Tac</h1>
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

        <StatusBar
          result={game.result}
          turn={game.turn}
          mode={game.mode}
          computer={computer}
        />

        <Board
          board={game.board}
          result={game.result}
          locked={computerTurn}
          onSelect={game.play}
        />

        <GameControls
          canUndo={game.history.length > 0}
          over={over}
          onUndo={game.undo}
          onNewRound={game.newRound}
        />
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <ScoreBoard
            stats={stats}
            mode={game.mode}
            computer={computer}
            onReset={reset}
          />
        </div>
        <div id="social">
          <MoveHistory history={game.history} onJump={game.jump} />
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
