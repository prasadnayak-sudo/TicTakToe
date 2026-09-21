import { ChartCard } from './ChartCard'
import { ChartTooltip } from './ChartTooltip'
import { useChartTooltip } from '../hooks/useChartTooltip'
import { openingCounts } from '../game/records'
import { bucket } from '../lib/chart'
import { squareLabel } from '../lib/format'
import type { BoardSize, GameRecord } from '../types/game'

const BUCKETS = 5

type Props = {
  log: GameRecord[]
  size: BoardSize
}

/**
 * Grid par magnitude — matlab heatmap, ek hi hue light se dark. Sirf maujooda
 * board size ke games, kyunki 3x3 aur 4x4 ke openings ek grid mein mila dena
 * galat hoga.
 */
export function OpeningHeatmap({ log, size }: Props) {
  const { tooltip, show, hide } = useChartTooltip()

  const counts = openingCounts(log, size)
  const max = Math.max(...counts, 0)
  const total = counts.reduce((sum, c) => sum + c, 0)

  const table = (
    <table>
      <thead>
        <tr>
          <th scope="col">Square</th>
          <th scope="col">Opened</th>
        </tr>
      </thead>
      <tbody>
        {counts.map((count, i) => (
          <tr key={i}>
            <th scope="row">{squareLabel(i, size)}</th>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <ChartCard
      title="Opening squares"
      subtitle={
        total === 0
          ? `No ${size}x${size} games yet`
          : `Where ${total} ${size}x${size} games started`
      }
      table={table}
    >
      {total === 0 ? (
        <p className="muted chart-empty">
          Play a {size}x{size} round and the grid fills in.
        </p>
      ) : (
        <>
          <div
            className="heatmap"
            style={{ '--board-size': size } as React.CSSProperties}
          >
            {counts.map((count, i) => {
              const step = bucket(count, max, BUCKETS)
              return (
                <button
                  key={i}
                  type="button"
                  className={`heat-cell heat-${step}`}
                  onMouseEnter={(e) => show(e, squareLabel(i, size), `${count} openings`)}
                  onMouseLeave={hide}
                  onFocus={(e) => show(e, squareLabel(i, size), `${count} openings`)}
                  onBlur={hide}
                >
                  {/* Direct label har cell par — value kabhi sirf colour se na padhni pade. */}
                  <span aria-hidden="true">{count || ''}</span>
                  <span className="sr-only">{`${squareLabel(i, size)}: ${count} openings`}</span>
                </button>
              )
            })}
          </div>

          {/* Sequential scale ki legend. */}
          <div className="heat-scale">
            <span className="muted">0</span>
            {Array.from({ length: BUCKETS }, (_, i) => (
              <span key={i} className={`legend-swatch heat-${i}`} aria-hidden="true" />
            ))}
            <span className="muted">{max}</span>
          </div>

          <ChartTooltip tooltip={tooltip} />
        </>
      )}
    </ChartCard>
  )
}
