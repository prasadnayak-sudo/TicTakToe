import { useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  /** Har chart ka table-view twin — value kabhi sirf colour mein nahi hoti. */
  table: ReactNode
  children: ReactNode
}

export function ChartCard({ title, subtitle, table, children }: Props) {
  const [showTable, setShowTable] = useState(false)

  return (
    <figure className="chart-card viz-root">
      <figcaption className="chart-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        <button
          type="button"
          className="link-button"
          aria-pressed={showTable}
          onClick={() => setShowTable((v) => !v)}
        >
          {showTable ? 'Chart' : 'Table'}
        </button>
      </figcaption>

      {showTable ? <div className="chart-table">{table}</div> : children}
    </figure>
  )
}
