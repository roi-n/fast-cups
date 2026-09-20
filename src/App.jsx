import { useEffect, useState } from 'react';
import './App.css';
import { signIn, signOut, watchAuthState } from './lib/auth';
import { drinkCup, watchLeaderboard } from './lib/cups';
import Login from './components/Login';
import TabBar from './components/TabBar';
import CounterTab from './components/CounterTab';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('counter');
  const [leaderboard, setLeaderboard] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return watchAuthState((u) => {
      setUser(u);
      setAuthReady(true);
      if (!u) setLeaderboard(null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchLeaderboard(setLeaderboard);
  }, [user]);

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

  const handleDrink = async () => {
    if (!user) return;
    setError(null);
    try {
      await drinkCup(user);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!authReady) {
    return (
      <div className="screen center">
        <div className="splash">💧</div>
      </div>
    );
  }

  if (!user) {
    return <Login onSignIn={handleSignIn} loading={signingIn} error={error} />;
  }

  const myCount = leaderboard?.find((row) => row.uid === user.uid)?.count ?? 0;

  return (
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

      <TabBar tab={tab} setTab={setTab} />

      {tab === 'counter' && (
        <CounterTab count={myCount} onDrink={handleDrink} error={error} />
      )}
      {tab === 'leaderboard' && <Leaderboard rows={leaderboard} me={user.uid} />}
    </div>
  );
}
