import React from 'react';
import { ColorPicker } from '../shared/ColorPicker';
import { SliderInput } from '../shared/SliderInput';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface MaterialSectionProps {
  entity: MapEntity;
}

export function MaterialSection({ entity }: MaterialSectionProps) {
  if (!entity.material) return null;
  const mat = entity.material;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Material
      </h4>
      <ColorPicker
        label="Base Color"
        value={mat.base_color}
        onChange={(v) => updateEntityComponent(entity.id, 'material', 'base_color', v)}
      />
      <ColorPicker
        label="Emissive"
        value={mat.emissive}
        onChange={(v) => updateEntityComponent(entity.id, 'material', 'emissive', v)}
      />
      <SliderInput
        label="Roughness"
        value={mat.roughness}
        onChange={(v) => updateEntityComponent(entity.id, 'material', 'roughness', v)}
      />
      <SliderInput
        label="Metallic"
        value={mat.metallic}
        onChange={(v) => updateEntityComponent(entity.id, 'material', 'metallic', v)}
      />
    </div>
  );
}
