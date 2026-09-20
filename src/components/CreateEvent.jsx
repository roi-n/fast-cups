import { useState } from 'react';

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const now = new Date();
const defaultEnd = new Date(now.getTime() + 12 * 60 * 60 * 1000);

export default function CreateEvent({ onCreate, loading, error }) {
  const [name, setName] = useState('');
  const [start, setStart] = useState(toLocalInputValue(now));
  const [end, setEnd] = useState(toLocalInputValue(defaultEnd));

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name: name.trim() || 'Fast', startTime: new Date(start), endTime: new Date(end) });
  };

  return (
    <div className="screen center create-event-screen">
      <div className="splash">💧</div>
      <h1>Start a fast</h1>
      <form className="create-event-form" onSubmit={handleSubmit}>
        <label>
          Event name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Yom Kippur Fast"
            required
          />
        </label>
        <label>
          Starts
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          Ends
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
        <button className="drink-btn" type="submit" disabled={loading}>
          {loading ? 'Creating…' : '💧 Create event'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
