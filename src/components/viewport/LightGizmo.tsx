import React from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MapEntity } from '../../types/map';
import { useSelection } from '../../store/use-selection';

interface LightGizmoProps {
  entity: MapEntity;
}

export function LightGizmo({ entity }: LightGizmoProps) {
  const { selectedIds, select, toggleSelect } = useSelection();
  const isSelected = selectedIds.has(entity.id);
  const [px, py, pz] = entity.transform.position;

  const isPoint = entity.type === 'point_light';
  const color = isPoint
    ? entity.point_light?.color ?? [1, 1, 0.8]
    : entity.directional_light?.color ?? [1, 0.95, 0.85];

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.nativeEvent?.shiftKey) {
      toggleSelect(entity.id);
    } else {
      select(entity.id);
    }
  };

  return (
    <group position={[px, py, pz]}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh onClick={handleClick}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial
            color={new THREE.Color(color[0], color[1], color[2])}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Outer ring for selection */}
        {isSelected && (
          <mesh>
            <ringGeometry args={[0.3, 0.38, 24]} />
            <meshBasicMaterial color="#ffaa00" side={THREE.DoubleSide} />
          </mesh>
        )}
        {/* Light type label */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.2}
          color="#aaa"
          anchorX="center"
          anchorY="top"
        >
          {isPoint ? 'Point' : 'Dir'}
        </Text>
      </Billboard>
      {/* Render actual light for viewport preview */}
      {isPoint && entity.point_light && (
        <pointLight
          color={new THREE.Color(color[0], color[1], color[2])}
          intensity={entity.point_light.intensity}
          distance={entity.point_light.radius}
        />
      )}
    </group>
  );
}
