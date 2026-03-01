import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LoginPage } from './pages/LoginPage';
import { handleCallback } from './lib/auth';
import { useAuth } from './store/use-auth';

function Router() {
  const { initialize, loading, user } = useAuth();
  const [path] = useState(() => window.location.pathname);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (path === '/auth/callback') {
    return <div style={{ color: '#ddd', background: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Signing in...</div>;
  }

  if (loading) {
    return <div style={{ color: '#ddd', background: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (path === '/login') {
    if (user) {
      window.location.replace('/');
      return null;
    }
    return <LoginPage />;
  }

  // All other paths: require auth
  if (!user) {
    window.location.replace('/login');
    return null;
  }

  return <App />;
}

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/auth/callback') {
  root.render(<Router />);
  handleCallback()
    .then(() => window.location.replace('/'))
    .catch((err) => {
      console.error('Auth callback failed:', err);
      window.location.replace('/login');
    });
} else {
  root.render(<Router />);
}
