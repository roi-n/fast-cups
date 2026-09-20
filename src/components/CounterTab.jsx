import TallyMarks from './TallyMarks';

export default function CounterTab({ count, onDrink, onUndo, canDrink, undoing, statusMessage, error }) {
  return (
    <div className="counter-tab">
      <div className="counter-card">
        <TallyMarks count={count} />
        <div className="count-label">
          {count} cup{count === 1 ? '' : 's'}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {statusMessage && <div className="status-message">{statusMessage}</div>}
      <button className="primary-btn" onClick={onDrink} disabled={!canDrink}>
        💧 Drank a cup!
      </button>
      <button className="secondary-btn" onClick={onUndo} disabled={count === 0 || undoing || !canDrink}>
        {undoing ? (
          <>
            <span className="spinner" /> Removing…
          </>
        ) : (
          '↩ Oops, remove one'
        )}
      </button>
    </div>
  );
}
