export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number]; // quaternion xyzw
export type RGBA = [number, number, number, number];

export type EntityType =
  | 'geometry'
  | 'point_light'
  | 'directional_light'
  | 'player_spawn'
  | 'enemy_spawn'
  | 'destructible'
  | 'spawner'
  | 'particle_emitter';

export interface ParticleEmitterData {
  burst_count: number;
  emit_interval: number;
  start_color: RGBA;
  end_color: RGBA;
  start_size: number;
  end_size: number;
  lifetime: number;
  speed: number;
}

export interface SpawnerConfigData {
  spawn_interval: number;
  max_count: number;
  spawn_radius: number;
}

export interface AIStateData {
  state: 'idle' | 'chase' | 'attack' | 'dead';
  detect_range: number;
  attack_range: number;
  move_speed: number;
  attack_cooldown: number;
}

export interface MapEntity {
  id: string;
  name: string;
  type: EntityType;
  mesh?: 'cube' | 'plane' | 'humanoid' | string;
  transform: {
    position: Vec3;
    rotation: Vec4;
    scale: Vec3;
  };
  material?: {
    base_color: RGBA;
    emissive: RGBA;
    roughness: number;
    metallic: number;
  };
  physics?: {
    type: 'static' | 'dynamic';
    shape: 'box' | 'sphere';
    half_extents?: Vec3;
    radius?: number;
  };
  health?: {
    current: number;
    max: number;
  };
  point_light?: {
    color: Vec3;
    intensity: number;
    radius: number;
  };
  directional_light?: {
    direction: Vec3;
    color: Vec3;
    intensity: number;
  };
  particle_emitter?: ParticleEmitterData;
  spawner_config?: SpawnerConfigData;
  ai_state?: AIStateData;
  angular_velocity?: {
    axis: Vec3;
    speed: number;
  };
  tags?: string[];
}

export interface MapSettings {
  ambient_color: RGBA;
  gravity: Vec3;
}

export interface MortarMap {
  version: 1;
  name: string;
  created_at: string;
  modified_at: string;
  settings: MapSettings;
  entities: MapEntity[];
}
