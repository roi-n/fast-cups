export default function TabBar({ tab, setTab, counterDisabled }) {
  return (
    <div className="segmented-control">
      <button
        className={`segment ${tab === 'counter' ? 'active' : ''}`}
        onClick={() => setTab('counter')}
        disabled={counterDisabled}
      >
        My Cups
      </button>
      <button
        className={`segment ${tab === 'leaderboard' ? 'active' : ''}`}
        onClick={() => setTab('leaderboard')}
      >
        Leaderboard
      </button>
    </div>
  );
}
