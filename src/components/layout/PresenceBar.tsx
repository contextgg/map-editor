import React from 'react';
import { useCollaboration } from '../../store/use-collaboration';

export function PresenceBar() {
  const { remoteUsers } = useCollaboration();

  return (
    <div style={{
      height: 28,
      background: '#1e1e1e',
      borderTop: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: 12,
      fontSize: 11,
      color: '#888',
    }}>
      <span>Mortar Map Editor</span>
      <div style={{ flex: 1 }} />
      {Array.from(remoteUsers.entries()).map(([clientId, user]) => (
        <div key={clientId} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: user.color,
          }} />
          <span style={{ color: '#aaa' }}>{user.name}</span>
        </div>
      ))}
    </div>
  );
}
