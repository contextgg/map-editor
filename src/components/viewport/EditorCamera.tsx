import React from 'react';
import { OrbitControls } from '@react-three/drei';

export function EditorCamera() {
  return (
    <OrbitControls
      makeDefault
      minDistance={1}
      maxDistance={200}
      enableDamping
      dampingFactor={0.1}
    />
  );
}
