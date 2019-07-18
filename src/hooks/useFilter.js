// @flow
import { useState, useCallback, useEffect } from 'react';

type State = {
  filter: Object,
  page: number,
  perPage: number,
  sort: {
    field: string,
    direction: string,
  },
};

function useFilter(state: State, cacheKey: string) {
  const localFilter = window.localStorage.getItem(cacheKey);
  const initialFilter = localFilter
    ? {
        ...state,
        ...JSON.parse(localFilter),
      }
    : state;

  const [filterAndSort, changeFilterAndSort] = useState(initialFilter);

  const onChangeFilter = useCallback((newFilter: Object) => {
    changeFilterAndSort(prevState => ({
      ...prevState,
      ...newFilter,
    }));
  }, []);

  useEffect(() => {
    if (window.localStorage) {
      const { filter, sort } = filterAndSort;
      window.localStorage.setItem(cacheKey, JSON.stringify({ filter, sort }));
    }
  }, [cacheKey, filterAndSort]);

  return {
    filterAndSort,
    queryVariables: {
      page: filterAndSort.page,
      perPage: filterAndSort.perPage,
      filterBy: filterAndSort.filter,
      sortBy: { [filterAndSort.sort.field]: filterAndSort.sort.direction },
    },
    onChangeFilter,
  };
}

export default useFilter;
