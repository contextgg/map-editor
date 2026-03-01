# map-editor

Collaborative 3D map editor for the [mortar](https://github.com/contextgg/mortar) game engine.

**React** | **Three.js** | **Yjs** (real-time collaboration)

## Quick Start

```bash
npm install

# Terminal 1: start the collaboration server
npm run server

# Terminal 2: start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to use the editor.

## Features

- 3D viewport with orbit camera and transform gizmos
- Entity placement: cubes, planes, lights, spawn points
- Physics, material, particle, and AI component editors
- Real-time multiplayer collaboration via Yjs + WebSocket
- Save/load maps as JSON (compatible with mortar engine)
- Undo/redo support

## Architecture

```
src/
  components/
    layout/      MenuBar, Toolbar, PropertiesPanel, PresenceBar
    panels/      Property editors (Transform, Physics, Material, etc.)
    shared/      Reusable inputs (Vec3Input, ColorPicker, SliderInput)
    viewport/    3D scene, camera, gizmos, entity rendering
  lib/           Map serialization, entity factories, helpers
  store/         Zustand stores + Yjs document sync
  server/        Express + y-websocket collaboration server
  types/         TypeScript type definitions
maps/            Example map files
```

## Map Format

Maps are JSON files with entities, each having a transform and optional components (physics, material, light, spawner, etc.). See `maps/` for examples.

## Deployment

Deployed to [editor.ctx.gg](https://editor.ctx.gg) on Fly.io.

## License

MIT
