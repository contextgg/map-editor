import { create } from 'zustand';
import type { ToolMode, PlaceType } from '../types/editor';

interface EditorModeState {
  toolMode: ToolMode;
  placeType: PlaceType;
  gridSnap: boolean;
  gridSize: number;
  setToolMode: (mode: ToolMode) => void;
  setPlaceType: (type: PlaceType) => void;
  toggleGridSnap: () => void;
  setGridSize: (size: number) => void;
}

export const useEditorMode = create<EditorModeState>((set) => ({
  toolMode: 'select',
  placeType: 'cube',
  gridSnap: false,
  gridSize: 1,
  setToolMode: (mode) => set({ toolMode: mode }),
  setPlaceType: (type) => set({ placeType: type }),
  toggleGridSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),
  setGridSize: (size) => set({ gridSize: size }),
}));
