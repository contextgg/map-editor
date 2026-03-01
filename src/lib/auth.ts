const ISSUER = import.meta.env.VITE_OIDC_ISSUER ?? 'http://localhost:3000';
const CLIENT_ID = 'map-editor';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

const TOKEN_KEY = 'mortar-auth-tokens';

interface TokenSet {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_at: number; // epoch ms
}

export interface AuthUser {
  sub: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
}

// --- PKCE helpers ---

function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = base64url(array.buffer);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = base64url(hash);
  return { verifier, challenge };
}

// --- Token storage ---

function getTokens(): TokenSet | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setTokens(tokens: TokenSet): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Public API ---

export function login(): void {
  generatePKCE().then(({ verifier, challenge }) => {
    const state = base64url(crypto.getRandomValues(new Uint8Array(16)).buffer);
    sessionStorage.setItem('oidc_verifier', verifier);
    sessionStorage.setItem('oidc_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'openid profile offline_access',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
    });

    window.location.href = `${ISSUER}/oidc/authorize?${params}`;
  });
}

export async function handleCallback(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) throw new Error('Missing code or state in callback');

  const savedState = sessionStorage.getItem('oidc_state');
  const verifier = sessionStorage.getItem('oidc_verifier');

  if (state !== savedState) throw new Error('State mismatch');
  if (!verifier) throw new Error('Missing PKCE verifier');

  sessionStorage.removeItem('oidc_state');
  sessionStorage.removeItem('oidc_verifier');

  const res = await fetch(`${ISSUER}/oidc/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  const data = await res.json();
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  setTokens({
    access_token: data.access_token,
    id_token: data.id_token,
    refresh_token: data.refresh_token,
    expires_at: expiresAt,
  });
}

export async function refreshAccessToken(): Promise<void> {
  const tokens = getTokens();
  if (!tokens?.refresh_token) throw new Error('No refresh token');

  const res = await fetch(`${ISSUER}/oidc/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id: CLIENT_ID,
    }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const data = await res.json();
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  setTokens({
    access_token: data.access_token,
    id_token: data.id_token ?? tokens.id_token,
    refresh_token: data.refresh_token ?? tokens.refresh_token,
    expires_at: expiresAt,
  });
}

export async function getAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;

  // Refresh if within 5 minutes of expiry
  if (tokens.expires_at - Date.now() < 5 * 60 * 1000) {
    try {
      await refreshAccessToken();
      return getTokens()!.access_token;
    } catch {
      return null;
    }
  }

  return tokens.access_token;
}

export function getUser(): AuthUser | null {
  const tokens = getTokens();
  if (!tokens?.id_token) return null;

  try {
    const payload = tokens.id_token.split('.')[1];
    // base64url → base64 → decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const claims = JSON.parse(json);
    return {
      sub: claims.sub,
      username: claims.username ?? claims.preferred_username ?? claims.sub,
      display_name: claims.display_name ?? claims.name,
      avatar_url: claims.avatar_url ?? claims.picture,
    };
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const tokens = getTokens();
  if (tokens?.refresh_token) {
    try {
      await fetch(`${ISSUER}/oidc/token/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: tokens.refresh_token,
          token_type_hint: 'refresh_token',
          client_id: CLIENT_ID,
        }),
      });
    } catch {
      // best-effort revocation
    }
  }
  clearTokens();
}

export function isLoggedIn(): boolean {
  const tokens = getTokens();
  if (!tokens) return false;
  // Consider logged in if we have a refresh token (access token can be refreshed)
  return !!tokens.refresh_token;
}
