import React from 'react';
import { login } from '../lib/auth';

export function LoginPage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: 8,
        padding: '48px 40px',
        minWidth: 320,
        textAlign: 'center',
      }}>
        <h1 style={{ color: '#ddd', fontSize: 24, margin: '0 0 8px', fontWeight: 600 }}>
          Mortar Editor
        </h1>
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 32px' }}>
          Sign in to start building maps
        </p>
        <button
          onClick={login}
          style={{
            width: '100%',
            padding: '10px 0',
            fontSize: 14,
            fontWeight: 500,
            background: '#4a9eff',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Sign In
        </button>
        <p style={{ color: '#666', fontSize: 12, marginTop: 20, marginBottom: 0 }}>
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); login(); }}
            style={{ color: '#4a9eff', textDecoration: 'none' }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
