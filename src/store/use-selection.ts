import { create } from 'zustand';

interface SelectionState {
  selectedIds: Set<string>;
  select: (id: string) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  setSelection: (ids: string[]) => void;
}

export const useSelection = create<SelectionState>((set) => ({
  selectedIds: new Set<string>(),
  select: (id) => set({ selectedIds: new Set([id]) }),
  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  clearSelection: () => set({ selectedIds: new Set() }),
  setSelection: (ids) => set({ selectedIds: new Set(ids) }),
}));
