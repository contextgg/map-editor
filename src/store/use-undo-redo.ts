import { useEffect, useState } from 'react';
import { UndoManager } from 'yjs';
import { yEntities } from './yjs-doc';

let undoManager: UndoManager | null = null;

function getUndoManager(): UndoManager {
  if (!undoManager) {
    undoManager = new UndoManager(yEntities, { captureTimeout: 200 });
  }
  return undoManager;
}

export function useUndoRedo() {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const um = getUndoManager();
    function update() {
      setCanUndo(um.undoStack.length > 0);
      setCanRedo(um.redoStack.length > 0);
    }
    um.on('stack-item-added', update);
    um.on('stack-item-popped', update);
    update();
    return () => {
      um.off('stack-item-added', update);
      um.off('stack-item-popped', update);
    };
  }, []);

  return {
    canUndo,
    canRedo,
    undo: () => getUndoManager().undo(),
    redo: () => getUndoManager().redo(),
  };
}
