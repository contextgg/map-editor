import React from 'react';
import { useMapEntities } from '../../store/use-map-entities';
import { useSelection } from '../../store/use-selection';
import { EntityMesh } from './EntityMesh';
import { LightGizmo } from './LightGizmo';
import { SpawnPointGizmo } from './SpawnPointGizmo';
import { TransformGizmo } from './TransformGizmo';
import { UserCursors3D } from './UserCursors3D';

export function EditorScene() {
  const entities = useMapEntities();
  const { selectedIds } = useSelection();

  // Find the single selected entity for transform gizmo
  const selectedArray = Array.from(selectedIds);
  const singleSelected = selectedArray.length === 1
    ? entities.find((e) => e.id === selectedArray[0])
    : undefined;

  return (
    <>
      {/* Ambient + default directional for viewport illumination */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      {entities.map((entity) => {
        switch (entity.type) {
          case 'geometry':
          case 'destructible':
            return <EntityMesh key={entity.id} entity={entity} />;
          case 'point_light':
          case 'directional_light':
            return <LightGizmo key={entity.id} entity={entity} />;
          case 'player_spawn':
          case 'enemy_spawn':
            return <SpawnPointGizmo key={entity.id} entity={entity} />;
          case 'spawner':
          case 'particle_emitter':
            return <SpawnPointGizmo key={entity.id} entity={entity} />;
          default:
            return null;
        }
      })}

      {singleSelected && <TransformGizmo entity={singleSelected} />}
      <UserCursors3D />
    </>
  );
}
