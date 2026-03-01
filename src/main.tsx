import { createRoot } from 'react-dom/client';
import App from './App';
import { handleCallback } from './lib/auth';

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/auth/callback') {
  root.render(<div style={{ color: '#ddd', background: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Signing in...</div>);
  handleCallback()
    .then(() => window.location.replace('/'))
    .catch((err) => {
      console.error('Auth callback failed:', err);
      window.location.replace('/');
    });
} else {
  root.render(<App />);
}
