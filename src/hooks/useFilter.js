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
        ...JSON.parse(localFilter),
        ...state,
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
      window.localStorage.setItem(cacheKey, JSON.stringify(filterAndSort));
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
