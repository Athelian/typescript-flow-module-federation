// @flow
import { useState, useCallback } from 'react';

type State = {
  viewType?: string,
  filter: Object,
  page: number,
  perPage: number,
  sort: {
    field: string,
    direction: string,
  },
};

function useFilter({ filter, sort, page = 1, perPage = 10, viewType, ...rest }: State) {
  const [filterAndSort, changeFilterAndSort] = useState({
    ...(viewType ? { viewType } : {}),
    filter,
    sort,
    page,
    perPage,
    ...rest,
  });

  const onChange = useCallback((newFilter: Object) => {
    changeFilterAndSort(prevState => ({
      ...prevState,
      ...newFilter,
    }));
  }, []);
  return {
    filterAndSort,
    queryVariables: {
      ...(viewType ? { viewType } : {}),
      page: filterAndSort.page,
      perPage: filterAndSort.perPage,
      filterBy: filterAndSort.filter,
      sortBy: { [filterAndSort.sort.field]: filterAndSort.sort.direction },
      ...rest,
    },
    onChange,
  };
}

export default useFilter;
