import React from 'react';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface HealthSectionProps {
  entity: MapEntity;
}

export function HealthSection({ entity }: HealthSectionProps) {
  if (!entity.health) return null;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Health
      </h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Current</label>
          <input
            type="number"
            value={entity.health.current}
            min={0}
            onChange={(e) => updateEntityComponent(entity.id, 'health', 'current', parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '2px 4px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Max</label>
          <input
            type="number"
            value={entity.health.max}
            min={1}
            onChange={(e) => updateEntityComponent(entity.id, 'health', 'max', parseFloat(e.target.value) || 1)}
            style={{ width: '100%', padding: '2px 4px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3 }}
          />
        </div>
      </div>
    </div>
  );
}
