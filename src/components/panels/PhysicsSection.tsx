import React from 'react';
import { Vec3Input } from '../shared/Vec3Input';
import { SliderInput } from '../shared/SliderInput';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface PhysicsSectionProps {
  entity: MapEntity;
}

export function PhysicsSection({ entity }: PhysicsSectionProps) {
  if (!entity.physics) return null;
  const phys = entity.physics;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Physics
      </h4>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Body Type</label>
        <select
          value={phys.type}
          onChange={(e) => updateEntityComponent(entity.id, 'physics', 'type', e.target.value)}
          style={{ width: '100%', padding: '3px 6px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3 }}
        >
          <option value="static">Static</option>
          <option value="dynamic">Dynamic</option>
        </select>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Shape</label>
        <select
          value={phys.shape}
          onChange={(e) => updateEntityComponent(entity.id, 'physics', 'shape', e.target.value)}
          style={{ width: '100%', padding: '3px 6px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3 }}
        >
          <option value="box">Box</option>
          <option value="sphere">Sphere</option>
        </select>
      </div>
      {phys.shape === 'box' && phys.half_extents && (
        <Vec3Input
          label="Half Extents"
          value={phys.half_extents}
          onChange={(v) => updateEntityComponent(entity.id, 'physics', 'half_extents', v)}
        />
      )}
      {phys.shape === 'sphere' && (
        <SliderInput
          label="Radius"
          value={phys.radius ?? 0.5}
          min={0.1}
          max={50}
          step={0.1}
          onChange={(v) => updateEntityComponent(entity.id, 'physics', 'radius', v)}
        />
      )}
    </div>
  );
}
