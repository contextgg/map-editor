import React from 'react';
import { Vec3Input } from '../shared/Vec3Input';
import { SliderInput } from '../shared/SliderInput';
import type { MapEntity, Vec3 } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';
import { vec3ToColor, hexToVec3 } from '../../lib/three-helpers';

interface LightSectionProps {
  entity: MapEntity;
}

export function LightSection({ entity }: LightSectionProps) {
  const isPoint = entity.type === 'point_light';
  const component = isPoint ? 'point_light' : 'directional_light';
  const light = isPoint ? entity.point_light : entity.directional_light;
  if (!light) return null;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        {isPoint ? 'Point Light' : 'Directional Light'}
      </h4>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Color</label>
        <input
          type="color"
          value={vec3ToColor(light.color)}
          onChange={(e) => updateEntityComponent(entity.id, component, 'color', hexToVec3(e.target.value))}
          style={{ width: 48, height: 24, border: 'none', cursor: 'pointer' }}
        />
      </div>
      <SliderInput
        label="Intensity"
        value={light.intensity}
        min={0}
        max={10}
        step={0.1}
        onChange={(v) => updateEntityComponent(entity.id, component, 'intensity', v)}
      />
      {isPoint && entity.point_light && (
        <SliderInput
          label="Radius"
          value={entity.point_light.radius}
          min={1}
          max={100}
          step={1}
          onChange={(v) => updateEntityComponent(entity.id, component, 'radius', v)}
        />
      )}
      {!isPoint && entity.directional_light && (
        <Vec3Input
          label="Direction"
          value={entity.directional_light.direction}
          step={0.05}
          onChange={(v) => updateEntityComponent(entity.id, component, 'direction', v)}
        />
      )}
    </div>
  );
}
