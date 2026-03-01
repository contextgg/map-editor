import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { MapEntity } from '../types/map';

// Singleton Y.Doc
export const ydoc = new Y.Doc();
export const yEntities: Y.Map<Y.Map<unknown>> = ydoc.getMap('entities');
export const ySettings: Y.Map<unknown> = ydoc.getMap('settings');

let provider: WebsocketProvider | null = null;

export function connectToRoom(roomName: string): WebsocketProvider {
  if (provider) {
    provider.disconnect();
    provider.destroy();
  }
  provider = new WebsocketProvider(
    `ws://${window.location.hostname}:3001/yjs`,
    roomName,
    ydoc
  );
  return provider;
}

export function getProvider(): WebsocketProvider | null {
  return provider;
}

function entityToYMap(entity: MapEntity): Y.Map<unknown> {
  const yEntity = new Y.Map<unknown>();
  yEntity.set('id', entity.id);
  yEntity.set('name', entity.name);
  yEntity.set('type', entity.type);
  if (entity.mesh) yEntity.set('mesh', entity.mesh);

  const yTransform = new Y.Map<unknown>();
  yTransform.set('position', entity.transform.position);
  yTransform.set('rotation', entity.transform.rotation);
  yTransform.set('scale', entity.transform.scale);
  yEntity.set('transform', yTransform);

  if (entity.material) {
    const yMat = new Y.Map<unknown>();
    yMat.set('base_color', entity.material.base_color);
    yMat.set('emissive', entity.material.emissive);
    yMat.set('roughness', entity.material.roughness);
    yMat.set('metallic', entity.material.metallic);
    yEntity.set('material', yMat);
  }

  if (entity.physics) {
    const yPhys = new Y.Map<unknown>();
    yPhys.set('type', entity.physics.type);
    yPhys.set('shape', entity.physics.shape);
    if (entity.physics.half_extents) yPhys.set('half_extents', entity.physics.half_extents);
    if (entity.physics.radius !== undefined) yPhys.set('radius', entity.physics.radius);
    yEntity.set('physics', yPhys);
  }

  if (entity.health) {
    const yHealth = new Y.Map<unknown>();
    yHealth.set('current', entity.health.current);
    yHealth.set('max', entity.health.max);
    yEntity.set('health', yHealth);
  }

  if (entity.point_light) {
    const yLight = new Y.Map<unknown>();
    yLight.set('color', entity.point_light.color);
    yLight.set('intensity', entity.point_light.intensity);
    yLight.set('radius', entity.point_light.radius);
    yEntity.set('point_light', yLight);
  }

  if (entity.directional_light) {
    const yLight = new Y.Map<unknown>();
    yLight.set('direction', entity.directional_light.direction);
    yLight.set('color', entity.directional_light.color);
    yLight.set('intensity', entity.directional_light.intensity);
    yEntity.set('directional_light', yLight);
  }

  if (entity.particle_emitter) {
    const yPE = new Y.Map<unknown>();
    for (const [k, v] of Object.entries(entity.particle_emitter)) {
      yPE.set(k, v);
    }
    yEntity.set('particle_emitter', yPE);
  }

  if (entity.spawner_config) {
    const ySC = new Y.Map<unknown>();
    for (const [k, v] of Object.entries(entity.spawner_config)) {
      ySC.set(k, v);
    }
    yEntity.set('spawner_config', ySC);
  }

  if (entity.ai_state) {
    const yAI = new Y.Map<unknown>();
    for (const [k, v] of Object.entries(entity.ai_state)) {
      yAI.set(k, v);
    }
    yEntity.set('ai_state', yAI);
  }

  if (entity.angular_velocity) {
    const yAV = new Y.Map<unknown>();
    yAV.set('axis', entity.angular_velocity.axis);
    yAV.set('speed', entity.angular_velocity.speed);
    yEntity.set('angular_velocity', yAV);
  }

  if (entity.tags) {
    yEntity.set('tags', entity.tags);
  }

  return yEntity;
}

function yMapToEntity(yEntity: Y.Map<unknown>): MapEntity {
  const yTransform = yEntity.get('transform') as Y.Map<unknown>;
  const entity: MapEntity = {
    id: yEntity.get('id') as string,
    name: yEntity.get('name') as string,
    type: yEntity.get('type') as MapEntity['type'],
    transform: {
      position: yTransform.get('position') as MapEntity['transform']['position'],
      rotation: yTransform.get('rotation') as MapEntity['transform']['rotation'],
      scale: yTransform.get('scale') as MapEntity['transform']['scale'],
    },
  };

  const mesh = yEntity.get('mesh');
  if (mesh) entity.mesh = mesh as MapEntity['mesh'];

  const yMat = yEntity.get('material') as Y.Map<unknown> | undefined;
  if (yMat) {
    entity.material = {
      base_color: yMat.get('base_color') as RGBA,
      emissive: yMat.get('emissive') as RGBA,
      roughness: yMat.get('roughness') as number,
      metallic: yMat.get('metallic') as number,
    };
  }

  const yPhys = yEntity.get('physics') as Y.Map<unknown> | undefined;
  if (yPhys) {
    entity.physics = {
      type: yPhys.get('type') as 'static' | 'dynamic',
      shape: yPhys.get('shape') as 'box' | 'sphere',
    };
    const he = yPhys.get('half_extents');
    if (he) entity.physics.half_extents = he as Vec3;
    const r = yPhys.get('radius');
    if (r !== undefined) entity.physics.radius = r as number;
  }

  const yHealth = yEntity.get('health') as Y.Map<unknown> | undefined;
  if (yHealth) {
    entity.health = {
      current: yHealth.get('current') as number,
      max: yHealth.get('max') as number,
    };
  }

  const yPL = yEntity.get('point_light') as Y.Map<unknown> | undefined;
  if (yPL) {
    entity.point_light = {
      color: yPL.get('color') as Vec3,
      intensity: yPL.get('intensity') as number,
      radius: yPL.get('radius') as number,
    };
  }

  const yDL = yEntity.get('directional_light') as Y.Map<unknown> | undefined;
  if (yDL) {
    entity.directional_light = {
      direction: yDL.get('direction') as Vec3,
      color: yDL.get('color') as Vec3,
      intensity: yDL.get('intensity') as number,
    };
  }

  const yPE = yEntity.get('particle_emitter') as Y.Map<unknown> | undefined;
  if (yPE) {
    entity.particle_emitter = {
      burst_count: yPE.get('burst_count') as number,
      emit_interval: yPE.get('emit_interval') as number,
      start_color: yPE.get('start_color') as RGBA,
      end_color: yPE.get('end_color') as RGBA,
      start_size: yPE.get('start_size') as number,
      end_size: yPE.get('end_size') as number,
      lifetime: yPE.get('lifetime') as number,
      speed: yPE.get('speed') as number,
    };
  }

  const ySC = yEntity.get('spawner_config') as Y.Map<unknown> | undefined;
  if (ySC) {
    entity.spawner_config = {
      spawn_interval: ySC.get('spawn_interval') as number,
      max_count: ySC.get('max_count') as number,
      spawn_radius: ySC.get('spawn_radius') as number,
    };
  }

  const yAI = yEntity.get('ai_state') as Y.Map<unknown> | undefined;
  if (yAI) {
    entity.ai_state = {
      state: yAI.get('state') as AIStateData['state'],
      detect_range: yAI.get('detect_range') as number,
      attack_range: yAI.get('attack_range') as number,
      move_speed: yAI.get('move_speed') as number,
      attack_cooldown: yAI.get('attack_cooldown') as number,
    };
  }

  const yAV = yEntity.get('angular_velocity') as Y.Map<unknown> | undefined;
  if (yAV) {
    entity.angular_velocity = {
      axis: yAV.get('axis') as Vec3,
      speed: yAV.get('speed') as number,
    };
  }

  const tags = yEntity.get('tags');
  if (tags) entity.tags = tags as string[];

  return entity;
}

export function addEntity(entity: MapEntity): void {
  ydoc.transact(() => {
    yEntities.set(entity.id, entityToYMap(entity));
  });
}

export function removeEntity(id: string): void {
  ydoc.transact(() => {
    yEntities.delete(id);
  });
}

export function updateEntityTransform(
  id: string,
  position: [number, number, number],
  rotation: [number, number, number, number],
  scale: [number, number, number]
): void {
  ydoc.transact(() => {
    const yEntity = yEntities.get(id);
    if (!yEntity) return;
    const yTransform = yEntity.get('transform') as Y.Map<unknown>;
    yTransform.set('position', position);
    yTransform.set('rotation', rotation);
    yTransform.set('scale', scale);
  });
}

export function updateEntityField(id: string, field: string, value: unknown): void {
  ydoc.transact(() => {
    const yEntity = yEntities.get(id);
    if (!yEntity) return;
    yEntity.set(field, value);
  });
}

export function updateEntityComponent(
  id: string,
  component: string,
  key: string,
  value: unknown
): void {
  ydoc.transact(() => {
    const yEntity = yEntities.get(id);
    if (!yEntity) return;
    const yComp = yEntity.get(component) as Y.Map<unknown> | undefined;
    if (yComp) {
      yComp.set(key, value);
    }
  });
}

export function getEntitiesSnapshot(): MapEntity[] {
  const entities: MapEntity[] = [];
  yEntities.forEach((yEntity) => {
    entities.push(yMapToEntity(yEntity));
  });
  return entities;
}

// Re-export types used in the converter
import type { RGBA, Vec3 } from '../types/map';
import type { AIStateData } from '../types/map';
export { yMapToEntity, entityToYMap };
