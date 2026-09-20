const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ rows, me, hasEnded }) {
  if (rows === null) {
    return <div className="leaderboard empty">Loading…</div>;
  }

  const winner = hasEnded && rows.length > 0 && rows[0].count > 0 ? rows[0] : null;

  return (
    <div className="leaderboard">
      {winner && (
        <div className="winner-banner">
          🏆 {winner.name} wins with {winner.count} cup{winner.count === 1 ? '' : 's'}!
        </div>
      )}
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
