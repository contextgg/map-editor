import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAPS_DIR = path.join(__dirname, '../../maps');

export async function ensureMapsDir(): Promise<void> {
  await fs.mkdir(MAPS_DIR, { recursive: true });
}

export async function saveMap(name: string, data: any): Promise<void> {
  await ensureMapsDir();
  const filePath = path.join(MAPS_DIR, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function loadMap(name: string): Promise<any | null> {
  const filePath = path.join(MAPS_DIR, `${name}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function listMaps(): Promise<string[]> {
  await ensureMapsDir();
  const files = await fs.readdir(MAPS_DIR);
  return files
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}
