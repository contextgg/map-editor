import React from 'react';
import { SliderInput } from '../shared/SliderInput';
import type { MapEntity } from '../../types/map';
import { updateEntityComponent } from '../../store/yjs-doc';

interface AISectionProps {
  entity: MapEntity;
}

export function AISection({ entity }: AISectionProps) {
  if (!entity.ai_state) return null;
  const ai = entity.ai_state;

  return (
    <div>
      <h4 style={{ fontSize: 12, color: '#aaa', marginBottom: 6, borderBottom: '1px solid #444', paddingBottom: 4 }}>
        AI State
      </h4>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Initial State</label>
        <select
          value={ai.state}
          onChange={(e) => updateEntityComponent(entity.id, 'ai_state', 'state', e.target.value)}
          style={{ width: '100%', padding: '3px 6px', fontSize: 12, background: '#2a2a2a', color: '#ddd', border: '1px solid #444', borderRadius: 3 }}
        >
          <option value="idle">Idle</option>
          <option value="chase">Chase</option>
          <option value="attack">Attack</option>
        </select>
      </div>
      <SliderInput label="Detect Range" value={ai.detect_range} min={1} max={100} step={1} onChange={(v) => updateEntityComponent(entity.id, 'ai_state', 'detect_range', v)} />
      <SliderInput label="Attack Range" value={ai.attack_range} min={1} max={50} step={0.5} onChange={(v) => updateEntityComponent(entity.id, 'ai_state', 'attack_range', v)} />
      <SliderInput label="Move Speed" value={ai.move_speed} min={0.5} max={20} step={0.5} onChange={(v) => updateEntityComponent(entity.id, 'ai_state', 'move_speed', v)} />
      <SliderInput label="Attack Cooldown" value={ai.attack_cooldown} min={0.1} max={10} step={0.1} onChange={(v) => updateEntityComponent(entity.id, 'ai_state', 'attack_cooldown', v)} />
    </div>
  );
}
