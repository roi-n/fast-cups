function TallyGroup({ filled }) {
  const bars = Math.min(filled, 4);
  return (
    <div className="tally-group">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={`tally-bar ${i < bars ? 'filled' : ''}`} />
      ))}
      {filled === 5 && <span className="tally-strike" />}
    </div>
  );
}

export default function TallyMarks({ count }) {
  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;
  const groups = Array.from({ length: fullGroups }, () => 5);
  groups.push(remainder);

  return (
    <div className="tally-grid">
      {groups.map((filled, i) => (
        <TallyGroup key={i} filled={filled} />
      ))}
    </div>
  );
}
