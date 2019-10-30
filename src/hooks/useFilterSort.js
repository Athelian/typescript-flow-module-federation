// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';
import { getCache, invalidateCache, setCache } from 'utils/cache';
import type { FilterBy, SortBy } from 'types';

type FilterSort = {
  query: string,
  filterBy: FilterBy,
  sortBy: SortBy,
  setQuery: string => void,
  setFilterBy: FilterBy => void,
  setSortBy: SortBy => void,
};

type FilterSortCache = {
  filterBy: FilterBy,
  sortBy: SortBy,
};

const KEY_PREFIX = 'zenport_filter_sort';

function getFilterSortCache(key: string): FilterSortCache | null {
  const value = getCache<FilterSortCache>(KEY_PREFIX, key);
  if (value) {
    const { filterBy = {}, sortBy = {} } = value;
    return { filterBy, sortBy };
  }

  return null;
}

function setFilterSortCache(key: string, { filterBy, sortBy }: FilterSortCache) {
  setCache(KEY_PREFIX, key, { filterBy, sortBy });
}

export function useFilterSortInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    invalidateCache(KEY_PREFIX);
  }, [authenticated]);
}

export default function useFilterSort(
  initialFilterBy: FilterBy,
  initialSortBy: SortBy,
  cacheKey: ?string = null
): FilterSort {
  const [filterBy, setFilterBy] = React.useState<FilterBy | null>(null);
  const [sortBy, setSortBy] = React.useState<SortBy | null>(null);

  function getFilterBy() {
    if (!filterBy) {
      if (cacheKey) {
        const cache = getFilterSortCache(cacheKey);
        if (cache) {
          setFilterBy(cache.filterBy);
          return cache.filterBy;
        }
      }

      setFilterBy(initialFilterBy);
      return initialFilterBy;
    }

    return filterBy;
  }

  function getSortBy() {
    if (!sortBy) {
      if (cacheKey) {
        const cache = getFilterSortCache(cacheKey);
        if (cache) {
          setSortBy(cache.sortBy);
          return cache.sortBy;
        }
      }

      setSortBy(initialSortBy);
      return initialSortBy;
    }

    return sortBy;
  }

  React.useEffect(() => {
    if (!cacheKey) {
      return;
    }

    const { query, ...cachableFilterBy } = filterBy || {};
    setFilterSortCache(cacheKey, { filterBy: cachableFilterBy, sortBy: sortBy || {} });
  }, [filterBy, sortBy, cacheKey]);

  const currentFilterBy = getFilterBy();
  const [query, filterByWithoutQuery] = React.useMemo(() => {
    const { query: q = '', ...rest } = currentFilterBy;
    return [q, rest];
  }, [currentFilterBy]);

  const setQuery = React.useCallback(
    (value: string) => {
      setFilterBy({
        ...filterBy,
        query: value,
      });
    },
    [filterBy, setFilterBy]
  );
  const setFilterByWithoutQuery = React.useCallback(
    (value: FilterBy) => {
      setFilterBy({
        ...value,
        query,
      });
    },
    [query]
  );

  return {
    query,
    filterBy: filterByWithoutQuery,
    sortBy: getSortBy(),
    setQuery,
    setFilterBy: setFilterByWithoutQuery,
    setSortBy,
  };
}
