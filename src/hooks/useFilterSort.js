// @flow
import * as React from 'react';
import { useListCache } from 'contexts/ListCache';

type FilterSort = {
  query: string,
  filterBy: { [string]: any },
  sortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
  setQuery: string => void,
  setFilterBy: ({ [string]: any }) => void,
  setSortBy: ({ [string]: 'ASCENDING' | 'DESCENDING' }) => void,
};

export default function useFilterSort(
  initialFilterBy: { [string]: any },
  initialSortBy: { [string]: 'ASCENDING' | 'DESCENDING' },
  cacheKey: string
): FilterSort {
  const { getListCache, setListCache } = useListCache();
  const [filterBy, setFilterBy] = React.useState<{ [string]: any } | null>(null);
  const [sortBy, setSortBy] = React.useState<{ [string]: 'ASCENDING' | 'DESCENDING' } | null>(null);

  function getFilterBy() {
    if (!filterBy) {
      const cache = getListCache(cacheKey);
      if (cache) {
        setFilterBy(cache.filterBy);
        return cache.filterBy;
      }

      setFilterBy(initialFilterBy);
      return initialFilterBy;
    }

    return filterBy;
  }

  function getSortBy() {
    if (!sortBy) {
      const cache = getListCache(cacheKey);
      if (cache) {
        setSortBy(cache.sortBy);
        return cache.sortBy;
      }

      setSortBy(initialSortBy);
      return initialSortBy;
    }

    return sortBy;
  }

  React.useEffect(() => {
    const { query, ...cachableFilterBy } = filterBy;
    setListCache(cacheKey, { filterBy: cachableFilterBy, sortBy });
  }, [filterBy, sortBy, cacheKey, setListCache]);

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
    (value: { [string]: any }) => {
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
