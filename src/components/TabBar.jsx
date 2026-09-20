export default function TabBar({ tab, setTab, counterDisabled }) {
  return (
    <nav className="tabbar">
      <button
        className={tab === 'counter' ? 'tab active' : 'tab'}
        onClick={() => setTab('counter')}
        disabled={counterDisabled}
      >
        🥤 My Cups
      </button>
      <button
        className={tab === 'leaderboard' ? 'tab active' : 'tab'}
        onClick={() => setTab('leaderboard')}
      >
        🏆 Leaderboard
      </button>
    </nav>
  );
}
