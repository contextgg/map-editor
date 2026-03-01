import React, { useEffect, useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MapEntity } from '../../types/map';
import { useEditorMode } from '../../store/use-editor-mode';
import { updateEntityTransform } from '../../store/yjs-doc';

interface TransformGizmoProps {
  entity: MapEntity;
}

export function TransformGizmo({ entity }: TransformGizmoProps) {
  const { toolMode } = useEditorMode();
  const controlsRef = useRef<any>(null);
  const { scene } = useThree();

  const mode = toolMode === 'select' ? 'translate' : toolMode;

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onDragEnd = () => {
      const obj = controls.object as THREE.Object3D;
      if (!obj) return;
      const pos = obj.position;
      const quat = obj.quaternion;
      const scale = obj.scale;
      updateEntityTransform(
        entity.id,
        [pos.x, pos.y, pos.z],
        [quat.x, quat.y, quat.z, quat.w],
        [scale.x, scale.y, scale.z]
      );
    };

    controls.addEventListener('dragging-changed', (event: { value: boolean }) => {
      if (!event.value) onDragEnd();
    });
  }, [entity.id]);

  // Find the mesh in the scene by entity id
  const [px, py, pz] = entity.transform.position;
  const [qx, qy, qz, qw] = entity.transform.rotation;
  const [sx, sy, sz] = entity.transform.scale;

  return (
    <TransformControls
      ref={controlsRef}
      mode={mode as 'translate' | 'rotate' | 'scale'}
      position={[px, py, pz]}
      quaternion={new THREE.Quaternion(qx, qy, qz, qw)}
      scale={[sx, sy, sz]}
      size={0.75}
    />
  );
}
