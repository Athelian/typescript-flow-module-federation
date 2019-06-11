// @flow
import { useState, useCallback } from 'react';

type State = {
  filter: Object,
  page: number,
  perPage: number,
  sort: {
    field: string,
    direction: string,
  },
};

function useSortAndFilter(initialFilter: State) {
  const [filterAndSort, changeFilterAndSort] = useState(initialFilter);

  const onChangeFilter = useCallback((newFilter: Object) => {
    changeFilterAndSort(prevState => ({
      ...prevState,
      ...newFilter,
    }));
  }, []);

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

export default useSortAndFilter;
