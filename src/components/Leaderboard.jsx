const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ rows, me, hasEnded }) {
  if (rows === null) {
    return <div className="page empty">Loading…</div>;
  }

  const winner = hasEnded && rows.length > 0 && rows[0].count > 0 ? rows[0] : null;

  return (
    <div className="page">
      {winner && (
        <div className="winner-banner">
          🏆 {winner.name} wins with {winner.count} cup{winner.count === 1 ? '' : 's'}!
        </div>
      )}
      {rows.length === 0 && <div className="empty">No cups logged yet — be the first!</div>}
      {rows.length > 0 && (
        <ol className="grouped-list">
          {rows.map((row, i) => (
            <li key={row.uid} className={row.uid === me ? 'is-current' : ''}>
              <div className="row-main">
                <span className="rank-badge">{MEDALS[i] || i + 1}</span>
                <span className="row-name">{row.name}</span>
                <span className="row-score">{row.count}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
