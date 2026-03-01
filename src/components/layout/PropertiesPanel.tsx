import React from 'react';
import { useSelection } from '../../store/use-selection';
import { useMapEntities } from '../../store/use-map-entities';
import { updateEntityField, removeEntity } from '../../store/yjs-doc';
import { TransformSection } from '../panels/TransformSection';
import { MaterialSection } from '../panels/MaterialSection';
import { PhysicsSection } from '../panels/PhysicsSection';
import { LightSection } from '../panels/LightSection';
import { HealthSection } from '../panels/HealthSection';
import { AISection } from '../panels/AISection';
import { SpawnerSection } from '../panels/SpawnerSection';
import { ParticleSection } from '../panels/ParticleSection';

export function PropertiesPanel() {
  const { selectedIds } = useSelection();
  const entities = useMapEntities();

  const selectedArray = Array.from(selectedIds);
  const selected = selectedArray.length === 1
    ? entities.find((e) => e.id === selectedArray[0])
    : undefined;

  return (
    <div style={{
      width: 240,
      background: '#242424',
      borderLeft: '1px solid #333',
      color: '#ddd',
      overflowY: 'auto',
      padding: 10,
    }}>
      {!selected && (
        <div style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 40 }}>
          {selectedArray.length === 0 ? 'No entity selected' : `${selectedArray.length} entities selected`}
        </div>
      )}

      {selected && (
        <>
          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Name</label>
            <input
              type="text"
              value={selected.name}
              onChange={(e) => updateEntityField(selected.id, 'name', e.target.value)}
              style={{
                width: '100%',
                padding: '4px 6px',
                fontSize: 13,
                background: '#2a2a2a',
                color: '#ddd',
                border: '1px solid #444',
                borderRadius: 3,
              }}
            />
            <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
              Type: {selected.type}
            </div>
          </div>

          <TransformSection entity={selected} />

          {selected.material && <MaterialSection entity={selected} />}
          {selected.physics && <PhysicsSection entity={selected} />}
          {(selected.type === 'point_light' || selected.type === 'directional_light') && (
            <LightSection entity={selected} />
          )}
          {selected.health && <HealthSection entity={selected} />}
          {selected.ai_state && <AISection entity={selected} />}
          {selected.spawner_config && <SpawnerSection entity={selected} />}
          {selected.particle_emitter && <ParticleSection entity={selected} />}

          {/* Delete */}
          <div style={{ marginTop: 16, borderTop: '1px solid #444', paddingTop: 12 }}>
            <button
              onClick={() => removeEntity(selected.id)}
              style={{
                width: '100%',
                padding: '6px 12px',
                fontSize: 12,
                background: '#5a2020',
                color: '#ff8888',
                border: '1px solid #8a3030',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Delete Entity
            </button>
          </div>
        </>
      )}
    </div>
  );
}
