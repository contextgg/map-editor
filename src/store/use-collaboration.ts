import { useEffect, useState } from 'react';
import { getProvider } from './yjs-doc';
import { useAuth } from './use-auth';
import type { Vec3 } from '../types/map';

export interface UserPresence {
  name: string;
  color: string;
  selectedIds: string[];
  cursorPosition3D: Vec3 | null;
}

const USER_COLORS = [
  '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
];

function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

function getUsername(): string {
  // Use authenticated username if logged in
  const authState = useAuth.getState();
  if (authState.user) {
    return authState.user.display_name ?? authState.user.username;
  }

  // Fall back to random localStorage name
  let name = localStorage.getItem('mortar-editor-username');
  if (!name) {
    name = `User-${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('mortar-editor-username', name);
  }
  return name;
}

export function useCollaboration() {
  const [remoteUsers, setRemoteUsers] = useState<Map<number, UserPresence>>(new Map());

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const awareness = provider.awareness;

    awareness.setLocalStateField('user', {
      name: getUsername(),
      color: getRandomColor(),
      selectedIds: [],
      cursorPosition3D: null,
    });

    function onAwarenessChange() {
      const states = awareness.getStates();
      const users = new Map<number, UserPresence>();
      states.forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user) {
          users.set(clientId, state.user as UserPresence);
        }
      });
      setRemoteUsers(users);
    }

    awareness.on('change', onAwarenessChange);
    return () => {
      awareness.off('change', onAwarenessChange);
    };
  }, []);

  const updateCursorPosition = (pos: Vec3 | null) => {
    const provider = getProvider();
    if (!provider) return;
    const current = provider.awareness.getLocalState()?.user as UserPresence | undefined;
    if (current) {
      provider.awareness.setLocalStateField('user', { ...current, cursorPosition3D: pos });
    }
  };

  const updateSelectedIds = (ids: string[]) => {
    const provider = getProvider();
    if (!provider) return;
    const current = provider.awareness.getLocalState()?.user as UserPresence | undefined;
    if (current) {
      provider.awareness.setLocalStateField('user', { ...current, selectedIds: ids });
    }
  };

  return { remoteUsers, updateCursorPosition, updateSelectedIds };
}
