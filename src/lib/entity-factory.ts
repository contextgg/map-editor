import { v4 as uuidv4 } from 'uuid';
import type { MapEntity, EntityType } from '../types/map';
import {
  DEFAULT_TRANSFORM,
  DEFAULT_MATERIAL,
  DEFAULT_PHYSICS_BOX,
  DEFAULT_POINT_LIGHT,
  DEFAULT_DIRECTIONAL_LIGHT,
  DEFAULT_HEALTH,
  DEFAULT_AI_STATE,
  DEFAULT_SPAWNER_CONFIG,
  DEFAULT_PARTICLE_EMITTER,
} from './entity-defaults';

let entityCounter = 0;

export function createEntity(type: EntityType, name?: string): MapEntity {
  entityCounter++;
  const base: MapEntity = {
    id: uuidv4(),
    name: name ?? `${type}_${entityCounter}`,
    type,
    transform: {
      position: [...DEFAULT_TRANSFORM.position],
      rotation: [...DEFAULT_TRANSFORM.rotation],
      scale: [...DEFAULT_TRANSFORM.scale],
    },
  };

  switch (type) {
    case 'geometry':
      return {
        ...base,
        mesh: 'cube',
        material: { ...DEFAULT_MATERIAL, base_color: [...DEFAULT_MATERIAL.base_color], emissive: [...DEFAULT_MATERIAL.emissive] },
        physics: { ...DEFAULT_PHYSICS_BOX, half_extents: [...DEFAULT_PHYSICS_BOX.half_extents] },
      };
    case 'point_light':
      return {
        ...base,
        point_light: { ...DEFAULT_POINT_LIGHT, color: [...DEFAULT_POINT_LIGHT.color] },
      };
    case 'directional_light':
      return {
        ...base,
        directional_light: {
          ...DEFAULT_DIRECTIONAL_LIGHT,
          direction: [...DEFAULT_DIRECTIONAL_LIGHT.direction],
          color: [...DEFAULT_DIRECTIONAL_LIGHT.color],
        },
      };
    case 'player_spawn':
      return {
        ...base,
        transform: {
          ...base.transform,
          position: [0, 2, 0],
        },
      };
    case 'enemy_spawn':
      return {
        ...base,
        ai_state: { ...DEFAULT_AI_STATE },
        health: { ...DEFAULT_HEALTH },
      };
    case 'destructible':
      return {
        ...base,
        mesh: 'cube',
        material: {
          base_color: [0.9, 0.2, 0.2, 1],
          emissive: [0, 0, 0, 0],
          roughness: 0.4,
          metallic: 0.3,
        },
        physics: { ...DEFAULT_PHYSICS_BOX, type: 'dynamic', half_extents: [...DEFAULT_PHYSICS_BOX.half_extents] },
        health: { ...DEFAULT_HEALTH },
      };
    case 'spawner':
      return {
        ...base,
        spawner_config: { ...DEFAULT_SPAWNER_CONFIG },
      };
    case 'particle_emitter':
      return {
        ...base,
        particle_emitter: {
          ...DEFAULT_PARTICLE_EMITTER,
          start_color: [...DEFAULT_PARTICLE_EMITTER.start_color],
          end_color: [...DEFAULT_PARTICLE_EMITTER.end_color],
        },
      };
  }
}

export function createCube(): MapEntity {
  return createEntity('geometry', `Cube_${entityCounter + 1}`);
}

export function createPlane(): MapEntity {
  const entity = createEntity('geometry', `Plane_${entityCounter}`);
  entity.mesh = 'plane';
  entity.transform.scale = [10, 1, 10];
  if (entity.physics) {
    entity.physics.half_extents = [5, 0.1, 5];
  }
  return entity;
}

export function createPointLight(): MapEntity {
  const entity = createEntity('point_light');
  entity.transform.position = [0, 3, 0];
  return entity;
}

export function createDirectionalLight(): MapEntity {
  return createEntity('directional_light');
}

export function createPlayerSpawn(): MapEntity {
  return createEntity('player_spawn');
}

export function createEnemySpawn(): MapEntity {
  return createEntity('enemy_spawn');
}
