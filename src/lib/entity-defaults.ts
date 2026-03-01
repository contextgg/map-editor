import type { MapEntity, RGBA, Vec3, Vec4 } from '../types/map';

const IDENTITY_QUAT: Vec4 = [0, 0, 0, 1];
const UNIT_SCALE: Vec3 = [1, 1, 1];
const ORIGIN: Vec3 = [0, 0, 0];
const WHITE: RGBA = [1, 1, 1, 1];
const BLACK: RGBA = [0, 0, 0, 0];

export const DEFAULT_TRANSFORM = {
  position: ORIGIN as Vec3,
  rotation: IDENTITY_QUAT as Vec4,
  scale: UNIT_SCALE as Vec3,
};

export const DEFAULT_MATERIAL = {
  base_color: [0.8, 0.8, 0.8, 1] as RGBA,
  emissive: BLACK as RGBA,
  roughness: 0.5,
  metallic: 0.0,
};

export const DEFAULT_PHYSICS_BOX = {
  type: 'static' as const,
  shape: 'box' as const,
  half_extents: [0.5, 0.5, 0.5] as Vec3,
};

export const DEFAULT_POINT_LIGHT = {
  color: [1, 1, 1] as Vec3,
  intensity: 2,
  radius: 10,
};

export const DEFAULT_DIRECTIONAL_LIGHT = {
  direction: [-0.4, -0.8, -0.4] as Vec3,
  color: [1, 0.95, 0.85] as Vec3,
  intensity: 1.2,
};

export const DEFAULT_HEALTH = {
  current: 100,
  max: 100,
};

export const DEFAULT_AI_STATE = {
  state: 'idle' as const,
  detect_range: 20,
  attack_range: 3,
  move_speed: 4,
  attack_cooldown: 1,
};

export const DEFAULT_SPAWNER_CONFIG = {
  spawn_interval: 4,
  max_count: 10,
  spawn_radius: 15,
};

export const DEFAULT_PARTICLE_EMITTER = {
  burst_count: 10,
  emit_interval: 0,
  start_color: [1, 0.8, 0.2, 1] as RGBA,
  end_color: [1, 0.2, 0, 0] as RGBA,
  start_size: 0.3,
  end_size: 0,
  lifetime: 0.5,
  speed: 5,
};

export const DEFAULT_ANGULAR_VELOCITY = {
  axis: [0, 1, 0] as Vec3,
  speed: 1,
};
