import type { Express } from 'express';
import express from 'express';
import { listMaps, loadMap, saveMap } from './persistence';

export function registerRoutes(app: Express): void {
  app.use(express.json());

  app.get('/api/maps', async (_req, res) => {
    try {
      const maps = await listMaps();
      res.json(maps);
    } catch (err) {
      console.error('Failed to list maps:', err);
      res.status(500).json({ error: 'Failed to list maps' });
    }
  });

  app.get('/api/maps/:name', async (req, res) => {
    try {
      const data = await loadMap(req.params.name);
      if (data === null) {
        res.status(404).json({ error: 'Map not found' });
        return;
      }
      res.json(data);
    } catch (err) {
      console.error(`Failed to load map ${req.params.name}:`, err);
      res.status(500).json({ error: 'Failed to load map' });
    }
  });

  app.post('/api/maps/:name', async (req, res) => {
    try {
      await saveMap(req.params.name, req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error(`Failed to save map ${req.params.name}:`, err);
      res.status(500).json({ error: 'Failed to save map' });
    }
  });
}
