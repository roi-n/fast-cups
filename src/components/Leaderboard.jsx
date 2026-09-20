const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ rows, me }) {
  if (rows === null) {
    return <div className="leaderboard empty">Loading…</div>;
  }

  return (
    <div className="leaderboard">
      {rows.length === 0 && <div className="empty">No cups logged yet — be the first!</div>}
      <ol className="leaderboard-list">
        {rows.map((row, i) => (
          <li key={row.uid} className={`leaderboard-row ${row.uid === me ? 'me' : ''}`}>
            <span className="rank">{MEDALS[i] || `#${i + 1}`}</span>
            <span className="name">{row.name}</span>
            <span className="score">{row.count}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
