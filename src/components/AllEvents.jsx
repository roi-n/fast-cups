export default function AllEvents({ events, loading, error, currentEventId, onSelect }) {
  return (
    <section className="card-section">
      <h2 className="section-title">All events</h2>
      {loading && <div className="empty">Loading…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && events.length === 0 && <div className="empty">No events yet.</div>}
      {!loading && events.length > 0 && (
        <ol className="grouped-list">
          {events.map((event) => {
            const isCurrent = event.id === currentEventId;
            return (
              <li
                key={event.id}
                className={`${isCurrent ? 'is-current' : ''} ${event.isEnded ? 'is-ended' : ''}`}
                onClick={() => !isCurrent && onSelect(event.id)}
                style={{ cursor: isCurrent ? 'default' : 'pointer' }}
              >
                <div className="row-main">
                  <span className="row-name">
                    {event.name}
                    {isCurrent ? ' · Current' : ''}
                  </span>
                  <span className="row-meta">
                    {new Date(event.endTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {event.isEnded && event.winner && (
                  <div className="row-sub">
                    🏆 {event.winner.name} — {event.winner.count} cup{event.winner.count === 1 ? '' : 's'}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
