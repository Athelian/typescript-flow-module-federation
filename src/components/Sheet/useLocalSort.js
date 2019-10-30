// @flow
import * as React from 'react';
import type { SortDirection } from 'types';
import { useAuthenticated } from 'contexts/Viewer';
import { getCache, invalidateCache, setCache } from 'utils/cache';

type LocalSort = Array<{ field: string, direction: SortDirection }>;

const KEY_PREFIX = 'zenport_sheet_local_sort';

function getLocalSortCache(key: string): LocalSort | null {
  return getCache<LocalSort>(KEY_PREFIX, key);
}

function setLocalSortCache(key: string, localSort: LocalSort) {
  setCache(KEY_PREFIX, key, localSort);
}

export function useLocalSortInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    invalidateCache(KEY_PREFIX);
  }, [authenticated]);
}

export default function useLocalSort(cacheKey: string): [LocalSort, (LocalSort) => void] {
  const [localSort, setLocalSort] = React.useState<LocalSort | null>(null);

  React.useEffect(() => {
    if (!cacheKey || !localSort) {
      return;
    }

    setLocalSortCache(cacheKey, localSort);
  }, [localSort, cacheKey]);

  function getLocalSort() {
    if (!localSort) {
      let value = [];

      if (cacheKey) {
        const cache = getLocalSortCache(cacheKey);
        if (cache) {
          value = cache;
        }
      }

      setLocalSort(value);

      return value;
    }

    return localSort;
  }

  return [getLocalSort(), setLocalSort];
}
