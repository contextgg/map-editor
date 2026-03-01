import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EditorCamera } from './EditorCamera';
import { EditorScene } from './EditorScene';
import { GridHelper } from './GridHelper';
import { useSelection } from '../../store/use-selection';

export function Viewport() {
  const { clearSelection } = useSelection();

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }}>
      <Canvas
        camera={{ position: [10, 8, 10], fov: 60, near: 0.1, far: 500 }}
        onPointerMissed={() => clearSelection()}
        shadows
      >
        <EditorCamera />
        <GridHelper />
        <EditorScene />
      </Canvas>
    </div>
  );
}
