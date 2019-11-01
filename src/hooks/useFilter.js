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
  const localSortAndQuery = window.localStorage.getItem(cacheKey);
  let localArchived;
  let localSort;
  let localQuery;

  if (localSortAndQuery) {
    const sortAndQuery = JSON.parse(localSortAndQuery);
    localArchived = sortAndQuery.archived;
    localSort = sortAndQuery.sort;
    localQuery = sortAndQuery.query;
  }

  const initialFilter = {
    filter: {
      ...state.filter,
      /* $FlowFixMe This comment suppresses an error found when upgrading Flow
       * to v0.111.0. To view the error, delete this comment and run Flow. */
      ...(localArchived === undefined ? {} : { archived: localArchived }),
      ...(localQuery === undefined ? {} : { query: localQuery }),
    },
    sort: {
      ...state.sort,
      ...(localSort || {}),
    },
    page: state.page,
    perPage: state.perPage,
  };

  const [filterAndSort, changeFilterAndSort] = useState(initialFilter);

  const onChangeFilter = useCallback((newFilter: Object) => {
    changeFilterAndSort(prevState => ({
      ...prevState,
      ...newFilter,
    }));
  }, []);

  useEffect(() => {
    const {
      filter: { archived, query },
      sort,
    } = filterAndSort;
    window.localStorage.setItem(cacheKey, JSON.stringify({ archived, query, sort }));
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
