import { totalGames, winRate } from '../game/stats'
import { percent, playerLabel, sizeLabel } from '../lib/format'
import type { BoardSize, Mode, Stats } from '../types/game'

type Props = {
  stats: Stats
  mode: Mode
  size: BoardSize
  computer: string
  onReset: () => void
}

export function ScoreBoard({ stats, mode, size, computer, onReset }: Props) {
  const vsComputer = mode === 'computer'

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Score</h2>
        <button type="button" className="link-button" onClick={onReset}>
          Reset
        </button>
      </div>
      <p className="muted">
        {sizeLabel(size)} · {vsComputer ? 'vs computer' : '2 players'} ·{' '}
        {totalGames(stats)} games
      </p>

      <ul className="scores">
        <li>
          <span className="score-label">
            {playerLabel('X', vsComputer && computer === 'X')}
          </span>
          <span className="score-value">{stats.X}</span>
          <span className="muted">{percent(winRate(stats, 'X'))}</span>
        </li>
        <li>
          <span className="score-label">
            {playerLabel('O', vsComputer && computer === 'O')}
          </span>
          <span className="score-value">{stats.O}</span>
          <span className="muted">{percent(winRate(stats, 'O'))}</span>
        </li>
        <li>
          <span className="score-label">Draws</span>
          <span className="score-value">{stats.draws}</span>
        </li>
      </ul>

      <p className="muted streak">
        {stats.currentStreak
          ? `Abhi ${stats.currentStreak.player} ki ${stats.currentStreak.length} ki streak`
          : 'Koi active streak nahi'}
        {stats.bestStreak > 0 && ` · best ${stats.bestStreak}`}
      </p>
    </div>
  )
}
