import { useEffect, useRef } from 'react'
import { Board } from './components/Board'
import { BoardSizeSelector } from './components/BoardSizeSelector'
import { DifficultySelector } from './components/DifficultySelector'
import { GameControls } from './components/GameControls'
import { ModeSelector } from './components/ModeSelector'
import { MoveHistory } from './components/MoveHistory'
import { OpeningHeatmap } from './components/OpeningHeatmap'
import { ResultsChart } from './components/ResultsChart'
import { ScoreBoard } from './components/ScoreBoard'
import { StatusBar } from './components/StatusBar'
import { other } from './game/board'
import { toRecord } from './game/records'
import { useComputerOpponent } from './hooks/useComputerOpponent'
import { useGame } from './hooks/useGame'
import { useGameLog } from './hooks/useGameLog'
import { useStats } from './hooks/useStats'
import './App.css'

function App() {
  const game = useGame()
  const { stats, record, reset } = useStats(game.mode, game.size)
  const { log, add: logGame } = useGameLog()

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

    const entry = toRecord(game.result, game, Date.now())
    if (entry) logGame(entry)
  }, [over, game.result, game, record, logGame])

  return (
    <>
      <section id="center">
        <div className="header">
          <h1> Tac</h1>
          <ModeSelector mode={game.mode} onChange={game.setMode} />
          <BoardSizeSelector size={game.size} onChange={game.setSize} />
          {game.mode === 'computer' && (
            <DifficultySelector
              difficulty={game.difficulty}
              onChange={game.setDifficulty}
            />
          )}
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
            size={game.size}
            computer={computer}
            onReset={reset}
          />
        </div>
        <div id="social">
          <MoveHistory
            history={game.history}
            size={game.size}
            onJump={game.jump}
          />
        </div>
      </section>

      <div className="ticks"></div>

      <section id="charts">
        <ResultsChart log={log} />
        <OpeningHeatmap log={log} size={game.size} />
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
