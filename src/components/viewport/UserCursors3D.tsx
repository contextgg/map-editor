import React from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useCollaboration } from '../../store/use-collaboration';

export function UserCursors3D() {
  const { remoteUsers } = useCollaboration();

  return (
    <>
      {Array.from(remoteUsers.entries()).map(([clientId, user]) => {
        if (!user.cursorPosition3D) return null;
        const [x, y, z] = user.cursorPosition3D;
        return (
          <group key={clientId} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshBasicMaterial color={user.color} transparent opacity={0.7} />
            </mesh>
            <Billboard position={[0, 0.35, 0]}>
              <Text fontSize={0.15} color={user.color} anchorX="center" anchorY="bottom">
                {user.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}
