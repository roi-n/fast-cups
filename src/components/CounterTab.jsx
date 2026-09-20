import TallyMarks from './TallyMarks';

export default function CounterTab({ count, onDrink, error }) {
  return (
    <div className="counter-tab">
      <TallyMarks count={count} />
      <div className="count-label">
        {count} cup{count === 1 ? '' : 's'}
      </div>
      {error && <div className="error">{error}</div>}
      <button className="drink-btn" onClick={onDrink}>
        💧 Drank a cup!
      </button>
    </div>
  );
}
