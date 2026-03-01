import React, { useRef } from 'react';
import * as THREE from 'three';
import type { MapEntity } from '../../types/map';
import { useSelection } from '../../store/use-selection';

interface EntityMeshProps {
  entity: MapEntity;
}

export function EntityMesh({ entity }: EntityMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectedIds, select, toggleSelect } = useSelection();
  const isSelected = selectedIds.has(entity.id);

  const [px, py, pz] = entity.transform.position;
  const [qx, qy, qz, qw] = entity.transform.rotation;
  const [sx, sy, sz] = entity.transform.scale;

  const baseColor = entity.material?.base_color ?? [0.8, 0.8, 0.8, 1];
  const emissive = entity.material?.emissive ?? [0, 0, 0, 0];
  const roughness = entity.material?.roughness ?? 0.5;
  const metallic = entity.material?.metallic ?? 0;

  const handleClick = (e: THREE.Event & { stopPropagation: () => void; nativeEvent: MouseEvent }) => {
    e.stopPropagation();
    if (e.nativeEvent.shiftKey) {
      toggleSelect(entity.id);
    } else {
      select(entity.id);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[px, py, pz]}
      quaternion={new THREE.Quaternion(qx, qy, qz, qw)}
      scale={[sx, sy, sz]}
      onClick={handleClick}
    >
      {entity.mesh === 'plane' ? (
        <planeGeometry args={[1, 1]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial
        color={new THREE.Color(baseColor[0], baseColor[1], baseColor[2])}
        emissive={new THREE.Color(emissive[0], emissive[1], emissive[2])}
        roughness={roughness}
        metalness={metallic}
        transparent={baseColor[3] < 1}
        opacity={baseColor[3]}
      />
      {isSelected && (
        <lineSegments>
          {entity.mesh === 'plane' ? (
            <edgesGeometry args={[new THREE.PlaneGeometry(1, 1)]} />
          ) : (
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          )}
          <lineBasicMaterial color="#ffaa00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}
