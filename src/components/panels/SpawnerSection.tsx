import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface SpawnerSectionProps {
  entity: MapEntity;
}

export function SpawnerSection({ entity }: SpawnerSectionProps) {
  if (!entity.spawner_config) return null;
  const cfg = entity.spawner_config;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Spawner
      </h4>
      <SliderInput label="Spawn Interval (s)" value={cfg.spawn_interval} min={0.5} max={30} step={0.5} onChange={(v) => updateEntityComponent(entity.id, 'spawner_config', 'spawn_interval', v)} />
      <SliderInput label="Max Count" value={cfg.max_count} min={1} max={50} step={1} onChange={(v) => updateEntityComponent(entity.id, 'spawner_config', 'max_count', v)} />
      <SliderInput label="Spawn Radius" value={cfg.spawn_radius} min={1} max={50} step={1} onChange={(v) => updateEntityComponent(entity.id, 'spawner_config', 'spawn_radius', v)} />
    </div>
  );
}
