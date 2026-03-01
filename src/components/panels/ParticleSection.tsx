import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import { ColorPicker } from '../shared/ColorPicker';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface ParticleSectionProps {
  entity: MapEntity;
}

export function ParticleSection({ entity }: ParticleSectionProps) {
  if (!entity.particle_emitter) return null;
  const pe = entity.particle_emitter;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        Particle Emitter
      </h4>
      <SliderInput label="Burst Count" value={pe.burst_count} min={1} max={100} step={1} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'burst_count', v)} />
      <SliderInput label="Emit Interval (s)" value={pe.emit_interval} min={0} max={5} step={0.1} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'emit_interval', v)} />
      <ColorPicker label="Start Color" value={pe.start_color} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'start_color', v)} />
      <ColorPicker label="End Color" value={pe.end_color} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'end_color', v)} />
      <SliderInput label="Start Size" value={pe.start_size} min={0} max={5} step={0.05} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'start_size', v)} />
      <SliderInput label="End Size" value={pe.end_size} min={0} max={5} step={0.05} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'end_size', v)} />
      <SliderInput label="Lifetime (s)" value={pe.lifetime} min={0.1} max={10} step={0.1} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'lifetime', v)} />
      <SliderInput label="Speed" value={pe.speed} min={0} max={50} step={0.5} onChange={(v) => updateEntityComponent(entity.id, 'particle_emitter', 'speed', v)} />
    </div>
  );
}
