import type { MapEntity, MapSettings, MortarMap } from '../types/map';
import { getEntitiesSnapshot, ySettings } from '../store/yjs-doc';

export function serializeMap(
  entities: MapEntity[],
  settings: MapSettings,
  name: string
): MortarMap {
  const now = new Date().toISOString();
  return {
    version: 1,
    name,
    created_at: now,
    modified_at: now,
    settings,
    entities,
  };
}

export function getDefaultSettings(): MapSettings {
  return {
    ambient_color: [0.1, 0.1, 0.15, 1],
    gravity: [0, -9.81, 0],
  };
}

export function getCurrentSettings(): MapSettings {
  const ambient = ySettings.get('ambient_color');
  const gravity = ySettings.get('gravity');
  return {
    ambient_color: (ambient as MapSettings['ambient_color']) ?? [0.1, 0.1, 0.15, 1],
    gravity: (gravity as MapSettings['gravity']) ?? [0, -9.81, 0],
  };
}

export function exportMapAsJSON(name: string): void {
  const entities = getEntitiesSnapshot();
  const settings = getCurrentSettings();
  const map = serializeMap(entities, settings, name);
  const json = JSON.stringify(map, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function saveMapToServer(name: string): Promise<void> {
  const entities = getEntitiesSnapshot();
  const settings = getCurrentSettings();
  const map = serializeMap(entities, settings, name);
  await fetch(`/api/maps/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(map),
  });
}
