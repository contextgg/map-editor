import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { registerRoutes } from './routes';
import { ensureMapsDir } from './persistence';

const PORT = parseInt(process.env.PORT || '3001', 10);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

registerRoutes(app);

// Serve static files in production
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));
app.get('*', (_req, res, next) => {
  if (_req.path.startsWith('/api') || _req.path.startsWith('/yjs')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  if (request.url?.startsWith('/yjs')) {
    wss.handleUpgrade(request, socket, head, async (ws) => {
      try {
        const utils = await import('y-websocket/bin/utils');
        const setupWSConnection = utils.setupWSConnection;
        setupWSConnection(ws, request);
      } catch (err) {
        console.error('Failed to setup WS connection:', err);
        ws.close();
      }
    });
  } else {
    socket.destroy();
  }
});

async function start() {
  await ensureMapsDir();
  server.listen(PORT, () => {
    console.log(`Map editor server listening on http://localhost:${PORT}`);
    console.log(`WebSocket endpoint: ws://localhost:${PORT}/yjs`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
