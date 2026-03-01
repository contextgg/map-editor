import React from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { MapEntity } from '../../types/map';
import { useSelection } from '../../store/use-selection';

interface SpawnPointGizmoProps {
  entity: MapEntity;
}

export function SpawnPointGizmo({ entity }: SpawnPointGizmoProps) {
  const { selectedIds, select, toggleSelect } = useSelection();
  const isSelected = selectedIds.has(entity.id);
  const [px, py, pz] = entity.transform.position;

  const isPlayer = entity.type === 'player_spawn';
  const color = isPlayer ? '#2ecc71' : '#e74c3c';
  const label = isPlayer ? 'Player' : 'Enemy';

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (e.nativeEvent?.shiftKey) {
      toggleSelect(entity.id);
    } else {
      select(entity.id);
    }
  };

  return (
    <group position={[px, py, pz]} onClick={handleClick}>
      {/* Flag pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.25, 1.25, 0]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.1, 12]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 24]} />
          <meshBasicMaterial color="#ffaa00" side={THREE.DoubleSide} />
        </mesh>
      )}
      <Billboard position={[0, 1.8, 0]}>
        <Text fontSize={0.2} color="#ccc" anchorX="center" anchorY="bottom">
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
