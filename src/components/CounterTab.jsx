import TallyMarks from './TallyMarks';

export default function CounterTab({ count, onDrink, onUndo, canDrink, statusMessage, error }) {
  return (
    <div className="counter-tab">
      <TallyMarks count={count} />
      <div className="count-label">
        {count} cup{count === 1 ? '' : 's'}
      </div>
      {error && <div className="error">{error}</div>}
      {statusMessage && <div className="status-message">{statusMessage}</div>}
      <button className="drink-btn" onClick={onDrink} disabled={!canDrink}>
        💧 Drank a cup!
      </button>
      <button className="undo-btn" onClick={onUndo} disabled={count === 0}>
        ↩ Oops, remove one
      </button>
    </div>
  );
}
