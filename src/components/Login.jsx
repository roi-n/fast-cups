export default function Login({ onSignIn, loading, error }) {
  return (
    <div className="screen center login-screen">
      <div className="splash">💧</div>
      <h1>Fast Cups</h1>
      <p className="tagline">Count every cup before the fast.</p>
      <button className="primary-btn" onClick={onSignIn} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in with Google'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
