import { useEffect, useState } from 'react';
import './App.css';
import { signIn, signOut, watchAuthState } from './lib/auth';
import { drinkCup, undoCup, watchLeaderboard } from './lib/cups';
import { createEvent, getEvent, resetAllCups } from './lib/events';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';
import TabBar from './components/TabBar';
import CounterTab from './components/CounterTab';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';

function getEventIdFromUrl() {
  return new URLSearchParams(window.location.search).get('event');
}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [eventId, setEventId] = useState(getEventIdFromUrl());
  const [event, setEvent] = useState(null);
  const [eventChecked, setEventChecked] = useState(false);
  const [tab, setTab] = useState('counter');
  const [leaderboard, setLeaderboard] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [error, setError] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [, forceTick] = useState(0);

  const hasEnded = event ? new Date() > event.endTime.toDate() : false;

  useEffect(() => {
    return watchAuthState((u) => {
      setUser(u);
      setAuthReady(true);
      if (!u) setLeaderboard(null);
    });
  }, []);

  useEffect(() => {
    if (!user || !eventId) return;
    setEventChecked(false);
    getEvent(eventId)
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setEventChecked(true));
  }, [user, eventId]);

  useEffect(() => {
    if (!event) return;
    document.title = `${event.name} · Fast Cups`;
  }, [event]);

  useEffect(() => {
    if (!eventId) return;
    return watchLeaderboard(eventId, setLeaderboard);
  }, [eventId]);

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hasEnded && tab === 'counter') {
      setTab('leaderboard');
    }
  }, [hasEnded, tab]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signIn();
    } catch (e) {
      setError(e.message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setTab('counter');
  };

  const handleCreateEvent = async ({ name, startTime, endTime }) => {
    setCreatingEvent(true);
    setError(null);
    try {
      const newId = await createEvent({
        name,
        startTime,
        endTime,
        adminUid: user.uid,
        adminName: user.name,
      });
      window.history.replaceState(null, '', `?event=${newId}`);
      setEventId(newId);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDrink = async () => {
    if (!user || !eventId) return;
    setError(null);
    try {
      await drinkCup(eventId, user);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUndo = async () => {
    if (!user || !eventId || undoing) return;
    setUndoing(true);
    setError(null);
    try {
      await undoCup(eventId, user);
    } catch (e) {
      setError(e.message);
    } finally {
      setUndoing(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset everyone's count to 0? This can't be undone.")) return;
    setError(null);
    try {
      await resetAllCups(eventId);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleStartNewEvent = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setEvent(null);
    setEventChecked(false);
    setError(null);
    setEventId(null);
  };

  let content;

  if (!authReady) {
    content = (
      <div className="screen center">
        <div className="splash">💧</div>
      </div>
    );
  } else if (!user) {
    content = <Login onSignIn={handleSignIn} loading={signingIn} error={error} />;
  } else if (!eventId) {
    content = <CreateEvent onCreate={handleCreateEvent} loading={creatingEvent} error={error} />;
  } else if (!eventChecked) {
    content = (
      <div className="screen center">
        <div className="splash">💧</div>
      </div>
    );
  } else if (!event) {
    content = (
      <div className="screen center">
        <p className="error">Event not found.</p>
        <button className="google-btn" onClick={handleStartNewEvent}>
          Start a new event
        </button>
      </div>
    );
  } else {
    const myCount = leaderboard?.find((row) => row.uid === user.uid)?.count ?? 0;
    const isAdmin = user.uid === event.adminUid;
    const now = new Date();
    const startTime = event.startTime.toDate();
    const endTime = event.endTime.toDate();
    const canDrink = now >= startTime && now <= endTime;
    const statusMessage =
      now < startTime
        ? `Starts ${startTime.toLocaleString([], { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}`
        : hasEnded
          ? 'Event ended — final tally!'
          : null;

    content = (
      <div className="screen">
        <header className="topbar">
          <div className="me">
            {user.picture && <img src={user.picture} alt="" className="avatar" />}
            <span>{user.name?.split(' ')[0]}</span>
          </div>
          <button className="link-btn" onClick={handleSignOut}>
            Sign out
          </button>
        </header>

        <div className="event-banner">
          <div className="event-name">{event.name}</div>
          <div className="event-actions">
            <button className="chip-btn" onClick={handleCopyLink}>
              {linkCopied ? '✓ Copied!' : '🔗 Invite'}
            </button>
            {isAdmin && (
              <button className="chip-btn danger" onClick={handleReset}>
                ⟳ Reset all
              </button>
            )}
          </div>
        </div>

        <TabBar tab={tab} setTab={setTab} counterDisabled={hasEnded} />

        {tab === 'counter' && (
          <CounterTab
            count={myCount}
            onDrink={handleDrink}
            onUndo={handleUndo}
            canDrink={canDrink}
            undoing={undoing}
            statusMessage={statusMessage}
            error={error}
          />
        )}
        {tab === 'leaderboard' && (
          <Leaderboard rows={leaderboard} me={user.uid} hasEnded={hasEnded} />
        )}
      </div>
    );
  }

  return (
    <>
      {content}
      <Footer />
    </>
  );
}
