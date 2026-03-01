import React, { useEffect } from 'react';
import { Toolbar } from './components/layout/Toolbar';
import { Viewport } from './components/viewport/Viewport';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { MenuBar } from './components/layout/MenuBar';
import { PresenceBar } from './components/layout/PresenceBar';
import { useEditorMode } from './store/use-editor-mode';
import { useSelection } from './store/use-selection';
import { useUndoRedo } from './store/use-undo-redo';
import { removeEntity, addEntity, getEntitiesSnapshot } from './store/yjs-doc';
import { v4 as uuidv4 } from 'uuid';
import type { MapEntity } from './types/map';

export default function App() {
  const { setToolMode } = useEditorMode();
  const { selectedIds, clearSelection } = useSelection();
  const { undo, redo } = useUndoRedo();

  useEffect(() => {
    let clipboard: MapEntity[] = [];

    function handleKeyDown(e: KeyboardEvent) {
      // Don't handle shortcuts when typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Tool modes
      if (e.key === 'q' || e.key === 'Q') { setToolMode('select'); return; }
      if (e.key === 'w' || e.key === 'W') { setToolMode('translate'); return; }
      if (e.key === 'e' || e.key === 'E') { setToolMode('rotate'); return; }
      if (e.key === 'r' || e.key === 'R') { setToolMode('scale'); return; }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        for (const id of selectedIds) {
          removeEntity(id);
        }
        clearSelection();
        return;
      }

      // Undo/Redo
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        redo();
        return;
      }

      // Copy
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        const entities = getEntitiesSnapshot();
        clipboard = entities.filter((en) => selectedIds.has(en.id));
        return;
      }

      // Paste
      if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        for (const entity of clipboard) {
          const clone: MapEntity = {
            ...JSON.parse(JSON.stringify(entity)),
            id: uuidv4(),
            name: entity.name + '_copy',
            transform: {
              ...entity.transform,
              position: [
                entity.transform.position[0] + 1,
                entity.transform.position[1],
                entity.transform.position[2] + 1,
              ],
            },
          };
          addEntity(clone);
        }
        return;
      }

      // Duplicate
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const entities = getEntitiesSnapshot();
        const selected = entities.filter((en) => selectedIds.has(en.id));
        for (const entity of selected) {
          const clone: MapEntity = {
            ...JSON.parse(JSON.stringify(entity)),
            id: uuidv4(),
            name: entity.name + '_dup',
            transform: {
              ...entity.transform,
              position: [
                entity.transform.position[0] + 1,
                entity.transform.position[1],
                entity.transform.position[2] + 1,
              ],
            },
          };
          addEntity(clone);
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, setToolMode, clearSelection, undo, redo]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '32px 1fr 28px',
      gridTemplateColumns: '180px 1fr 240px',
      width: '100vw',
      height: '100vh',
      background: '#1a1a1a',
      color: '#ddd',
    }}>
      {/* Menu Bar - top, full width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <MenuBar />
      </div>

      {/* Toolbar - left */}
      <Toolbar />

      {/* Viewport - center */}
      <Viewport />

      {/* Properties Panel - right */}
      <PropertiesPanel />

      {/* Presence Bar - bottom, full width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <PresenceBar />
      </div>
    </div>
  );
}
