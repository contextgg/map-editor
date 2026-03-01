import React from 'react';
import { Vec3Input } from '../shared/Vec3Input';
import type { MapEntity, Vec3, Vec4 } from '../../types/map';
import { quatToEulerDeg, eulerDegToQuat } from '../../lib/three-helpers';
import { updateEntityTransform } from '../../store/yjs-doc';

interface TransformSectionProps {
  entity: MapEntity;
}

export function TransformSection({ entity }: TransformSectionProps) {
  const { position, rotation, scale } = entity.transform;
  const eulerDeg = quatToEulerDeg(rotation);

  const updateTransform = (pos: Vec3, rot: Vec4, scl: Vec3) => {
    updateEntityTransform(entity.id, pos, rot, scl);
  };

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Transform
      </h4>
      <Vec3Input
        label="Position"
        value={position}
        onChange={(v) => updateTransform(v, rotation, scale)}
      />
      <Vec3Input
        label="Rotation"
        value={eulerDeg}
        step={1}
        onChange={(v) => updateTransform(position, eulerDegToQuat(v), scale)}
      />
      <Vec3Input
        label="Scale"
        value={scale}
        onChange={(v) => updateTransform(position, rotation, v)}
      />
    </div>
  );
}
