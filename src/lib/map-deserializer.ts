import type { MapEntity, MapSettings, MortarMap } from '../types/map';
import { ydoc, yEntities, ySettings, addEntity } from '../store/yjs-doc';

export function deserializeMap(json: string): {
  entities: MapEntity[];
  settings: MapSettings;
  name: string;
} {
  const map: MortarMap = JSON.parse(json);
  if (map.version !== 1) {
    throw new Error(`Unsupported map version: ${map.version}`);
  }
  return {
    entities: map.entities,
    settings: map.settings,
    name: map.name,
  };
}

export function loadMapIntoYjs(map: MortarMap): void {
  ydoc.transact(() => {
    // Clear existing entities
    const keys = Array.from(yEntities.keys());
    for (const key of keys) {
      yEntities.delete(key);
    }

    // Load settings
    ySettings.set('ambient_color', map.settings.ambient_color);
    ySettings.set('gravity', map.settings.gravity);

    // Load entities
    for (const entity of map.entities) {
      addEntity(entity);
    }
  });
}

export async function loadMapFromServer(name: string): Promise<MortarMap | null> {
  const res = await fetch(`/api/maps/${encodeURIComponent(name)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function listMapsFromServer(): Promise<string[]> {
  const res = await fetch('/api/maps');
  if (!res.ok) return [];
  return res.json();
}
