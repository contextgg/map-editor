import React from 'react';

export function GridHelper() {
  return (
    <group>
      <gridHelper args={[100, 100, '#444', '#333']} />
      {/* X axis - red */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0.01, 0, 5, 0.01, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#e74c3c" linewidth={2} />
      </line>
      {/* Y axis - green */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 5, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2ecc71" linewidth={2} />
      </line>
      {/* Z axis - blue */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0.01, 0, 0, 0.01, 5])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3498db" linewidth={2} />
      </line>
    </group>
  );
}
