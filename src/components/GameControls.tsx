type Props = {
  canUndo: boolean
  over: boolean
  onUndo: () => void
  onNewRound: () => void
}

export function GameControls({ canUndo, over, onUndo, onNewRound }: Props) {
  return (
    <div className="controls">
      <button
        type="button"
        className="button"
        disabled={!canUndo}
        onClick={onUndo}
      >
        Undo
      </button>
      <button type="button" className="button primary" onClick={onNewRound}>
        {over ? 'Phir se khelo' : 'Reset board'}
      </button>
    </div>
  )
}
