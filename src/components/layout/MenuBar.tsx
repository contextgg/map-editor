import React, { useState, useRef, useEffect } from 'react';
import { exportMapAsJSON, saveMapToServer } from '../../lib/map-serializer';
import { loadMapFromServer, listMapsFromServer, loadMapIntoYjs } from '../../lib/map-deserializer';
import { ydoc, yEntities } from '../../store/yjs-doc';
import { useUndoRedo } from '../../store/use-undo-redo';
import { useAuth } from '../../store/use-auth';

export function MenuBar() {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [mapName, setMapName] = useState('untitled');
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [availableMaps, setAvailableMaps] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowFileMenu(false);
        setShowLoadDialog(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNew = () => {
    ydoc.transact(() => {
      const keys = Array.from(yEntities.keys());
      for (const key of keys) yEntities.delete(key);
    });
    setMapName('untitled');
    setShowFileMenu(false);
  };

  const handleSave = async () => {
    await saveMapToServer(mapName);
    setShowFileMenu(false);
  };

  const handleLoad = async () => {
    const maps = await listMapsFromServer();
    setAvailableMaps(maps);
    setShowLoadDialog(true);
    setShowFileMenu(false);
  };

  const handleLoadMap = async (name: string) => {
    const map = await loadMapFromServer(name);
    if (map) {
      loadMapIntoYjs(map);
      setMapName(name);
    }
    setShowLoadDialog(false);
  };

  const handleExport = () => {
    exportMapAsJSON(mapName);
    setShowFileMenu(false);
  };

  const menuItemStyle = {
    display: 'block',
    width: '100%',
    padding: '6px 16px',
    fontSize: 12,
    background: 'none',
    color: '#ddd',
    border: 'none',
    textAlign: 'left' as const,
    cursor: 'pointer' as const,
  };

  return (
    <div style={{
      height: 32,
      background: '#1a1a1a',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
      gap: 2,
    }}
    ref={menuRef}
    >
      {/* File Menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowFileMenu(!showFileMenu)}
          style={{
            padding: '4px 12px',
            fontSize: 12,
            background: showFileMenu ? '#333' : 'transparent',
            color: '#ccc',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 3,
          }}
        >
          File
        </button>
        {showFileMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: 4,
            padding: '4px 0',
            minWidth: 160,
            zIndex: 100,
          }}>
            <button style={menuItemStyle} onClick={handleNew}>New Map</button>
            <button style={menuItemStyle} onClick={handleSave}>Save to Server</button>
            <button style={menuItemStyle} onClick={handleLoad}>Load from Server...</button>
            <div style={{ borderTop: '1px solid #444', margin: '4px 0' }} />
            <button style={menuItemStyle} onClick={handleExport}>Export JSON</button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <button
        onClick={undo}
        disabled={!canUndo}
        style={{
          padding: '4px 8px',
          fontSize: 12,
          background: 'transparent',
          color: canUndo ? '#ccc' : '#555',
          border: 'none',
          cursor: canUndo ? 'pointer' : 'default',
        }}
        title="Undo (Ctrl+Z)"
      >
        Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        style={{
          padding: '4px 8px',
          fontSize: 12,
          background: 'transparent',
          color: canRedo ? '#ccc' : '#555',
          border: 'none',
          cursor: canRedo ? 'pointer' : 'default',
        }}
        title="Redo (Ctrl+Shift+Z)"
      >
        Redo
      </button>

      <div style={{ flex: 1 }} />

      {/* Auth */}
      {!loading && (
        user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
            <span style={{ fontSize: 12, color: '#ccc' }}>{user.username}</span>
            <button
              onClick={() => logout()}
              style={{
                padding: '3px 10px',
                fontSize: 11,
                background: '#333',
                color: '#aaa',
                border: '1px solid #444',
                borderRadius: 3,
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            style={{
              padding: '3px 10px',
              fontSize: 11,
              background: '#333',
              color: '#ccc',
              border: '1px solid #444',
              borderRadius: 3,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            Sign In
          </button>
        )
      )}

      {/* Map Name */}
      <input
        type="text"
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
        style={{
          padding: '2px 8px',
          fontSize: 12,
          background: '#2a2a2a',
          color: '#ddd',
          border: '1px solid #444',
          borderRadius: 3,
          width: 140,
          textAlign: 'center',
        }}
        title="Map Name"
      />

      {/* Load Dialog */}
      {showLoadDialog && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
        }}>
          <div style={{
            background: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: 8,
            padding: 20,
            minWidth: 300,
          }}>
            <h3 style={{ color: '#ddd', margin: '0 0 12px', fontSize: 14 }}>Load Map</h3>
            {availableMaps.length === 0 && (
              <div style={{ color: '#888', fontSize: 12 }}>No saved maps found</div>
            )}
            {availableMaps.map((name) => (
              <button
                key={name}
                onClick={() => handleLoadMap(name)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: 13,
                  background: '#333',
                  color: '#ddd',
                  border: '1px solid #444',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginBottom: 4,
                  textAlign: 'left',
                }}
              >
                {name}
              </button>
            ))}
            <button
              onClick={() => setShowLoadDialog(false)}
              style={{
                marginTop: 12,
                padding: '6px 16px',
                fontSize: 12,
                background: '#444',
                color: '#ccc',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
