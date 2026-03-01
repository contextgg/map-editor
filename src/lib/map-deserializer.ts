import type { MapEntity, MapSettings, MortarMap } from '../types/map';
import { ydoc, yEntities, ySettings, addEntity } from '../store/yjs-doc';
import { getAccessToken } from './auth';

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
  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api/maps/${encodeURIComponent(name)}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export async function listMapsFromServer(): Promise<string[]> {
  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch('/api/maps', { headers });
  if (!res.ok) return [];
  return res.json();
}
