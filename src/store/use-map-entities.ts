import { useEffect, useState } from 'react';
import { yEntities, yMapToEntity } from './yjs-doc';
import type { MapEntity } from '../types/map';
import type * as Y from 'yjs';

export function useMapEntities(): MapEntity[] {
  const [entities, setEntities] = useState<MapEntity[]>([]);

  useEffect(() => {
    function sync() {
      const result: MapEntity[] = [];
      yEntities.forEach((yEntity: Y.Map<unknown>) => {
        result.push(yMapToEntity(yEntity));
      });
      setEntities(result);
    }

    sync();
    yEntities.observeDeep(sync);
    return () => yEntities.unobserveDeep(sync);
  }, []);

  return entities;
}
