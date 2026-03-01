import React from 'react';
import { useEditorMode } from '../../store/use-editor-mode';
import { useMapEntities } from '../../store/use-map-entities';
import { useSelection } from '../../store/use-selection';
import { EntityList } from '../shared/EntityList';
import { addEntity, removeEntity } from '../../store/yjs-doc';
import { createCube, createPlane, createPointLight, createDirectionalLight, createPlayerSpawn, createEnemySpawn, createEntity } from '../../lib/entity-factory';
import type { ToolMode } from '../../types/editor';

const toolButtons: { mode: ToolMode; label: string; key: string }[] = [
  { mode: 'select', label: 'Select', key: 'Q' },
  { mode: 'translate', label: 'Move', key: 'W' },
  { mode: 'rotate', label: 'Rotate', key: 'E' },
  { mode: 'scale', label: 'Scale', key: 'R' },
];

const addButtons = [
  { label: 'Cube', action: createCube },
  { label: 'Plane', action: createPlane },
  { label: 'Point Light', action: createPointLight },
  { label: 'Dir Light', action: createDirectionalLight },
  { label: 'Player Spawn', action: createPlayerSpawn },
  { label: 'Enemy Spawn', action: createEnemySpawn },
  { label: 'Destructible', action: () => createEntity('destructible') },
  { label: 'Spawner', action: () => createEntity('spawner') },
  { label: 'Particles', action: () => createEntity('particle_emitter') },
];

export function Toolbar() {
  const { toolMode, setToolMode, gridSnap, toggleGridSnap, gridSize, setGridSize } = useEditorMode();
  const entities = useMapEntities();
  const { selectedIds, select, toggleSelect } = useSelection();

  const btnStyle = (active: boolean) => ({
    padding: '4px 10px',
    fontSize: 11,
    background: active ? '#3a5a8a' : '#333',
    color: active ? '#fff' : '#ccc',
    border: '1px solid ' + (active ? '#5a8aba' : '#555'),
    borderRadius: 3,
    cursor: 'pointer' as const,
    width: '100%',
  });

  return (
    <div style={{
      width: 180,
      background: '#242424',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      color: '#ddd',
      overflow: 'hidden',
    }}>
      {/* Tool Mode */}
      <div style={{ padding: 8, borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>Tools</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {toolButtons.map((b) => (
            <button
              key={b.mode}
              onClick={() => setToolMode(b.mode)}
              style={btnStyle(toolMode === b.mode)}
            >
              {b.label} ({b.key})
            </button>
          ))}
        </div>
      </div>

      {/* Add Entity */}
      <div style={{ padding: 8, borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>Add Entity</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {addButtons.map((b) => (
            <button
              key={b.label}
              onClick={() => addEntity(b.action())}
              style={btnStyle(false)}
            >
              + {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Snap */}
      <div style={{ padding: 8, borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>Grid</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={gridSnap} onChange={toggleGridSnap} />
          Snap to Grid
        </label>
        {gridSnap && (
          <div style={{ marginTop: 4 }}>
            <label style={{ fontSize: 11, color: '#999' }}>Size</label>
            <input
              type="number"
              value={gridSize}
              min={0.1}
              step={0.25}
              onChange={(e) => setGridSize(parseFloat(e.target.value) || 1)}
              style={{ width: '100%', padding: '2px 4px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3, marginTop: 2 }}
            />
          </div>
        )}
      </div>

      {/* Entity List */}
      <div style={{ padding: 8, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ fontSize: 10, color: '#888', marginBottom: 4, textTransform: 'uppercase' }}>
          Entities ({entities.length})
        </div>
        <EntityList
          entities={entities}
          selectedIds={selectedIds}
          onSelect={(id, multi) => multi ? toggleSelect(id) : select(id)}
          onDelete={(id) => removeEntity(id)}
        />
      </div>
    </div>
  );
}
