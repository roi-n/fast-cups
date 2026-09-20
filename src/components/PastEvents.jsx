export default function PastEvents({ events, loading, error, currentEventId, onSelect }) {
  if (loading) {
    return <div className="leaderboard empty">Loading…</div>;
  }

  return (
    <div className="leaderboard">
      {error && <div className="error">{error}</div>}
      {events.length === 0 && <div className="empty">No events yet.</div>}
      <ul className="past-events-list">
        {events.map((event) => {
          const isCurrent = event.id === currentEventId;
          return (
            <li
              key={event.id}
              className={`past-event-row ${isCurrent ? 'current' : ''} ${event.isEnded ? 'ended' : ''}`}
              onClick={() => !isCurrent && onSelect(event.id)}
              style={{ cursor: isCurrent ? 'default' : 'pointer' }}
            >
              <div className="past-event-main">
                <span>
                  {event.name}
                  {isCurrent ? ' (current)' : ''}
                </span>
                <span>{new Date(event.endTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
              {event.isEnded && event.winner && (
                <div className="past-event-winner">
                  🏆 {event.winner.name} — {event.winner.count} cup{event.winner.count === 1 ? '' : 's'}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
