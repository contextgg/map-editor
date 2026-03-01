import React from 'react';
import type { MapEntity } from '../../types/map';

const TYPE_ICONS: Record<string, string> = {
  geometry: '\u25A0',
  point_light: '\u2600',
  directional_light: '\u2600',
  player_spawn: '\u2691',
  enemy_spawn: '\u2620',
  destructible: '\u2B22',
  spawner: '\u2699',
  particle_emitter: '\u2728',
};

interface EntityListProps {
  entities: MapEntity[];
  selectedIds: Set<string>;
  onSelect: (id: string, multi: boolean) => void;
  onDelete: (id: string) => void;
}

export function EntityList({ entities, selectedIds, onSelect, onDelete }: EntityListProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {entities.map((e) => (
        <div
          key={e.id}
          onClick={(ev) => onSelect(e.id, ev.shiftKey)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 8px',
            cursor: 'pointer',
            background: selectedIds.has(e.id) ? '#3a5a8a' : 'transparent',
            borderRadius: 3,
            fontSize: 12,
          }}
        >
          <span style={{ width: 16, textAlign: 'center' }}>
            {TYPE_ICONS[e.type] ?? '?'}
          </span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {e.name}
          </span>
          <button
            onClick={(ev) => { ev.stopPropagation(); onDelete(e.id); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 14,
              padding: '0 2px',
            }}
            title="Delete"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
