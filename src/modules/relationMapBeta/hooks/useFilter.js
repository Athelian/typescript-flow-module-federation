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

function useFilter({ filter, sort, page = 1, perPage = 10 }: State) {
  const [filterAndSort, changeFilterAndSort] = useState({
    filter,
    sort,
    page,
    perPage,
  });

  const onChange = useCallback((newFilter: Object) => {
    console.warn({ newFilter });
    changeFilterAndSort({
      ...filterAndSort,
      ...newFilter,
    });
  }, []);

  return {
    filterAndSort,
    queryVariables: {
      page: filterAndSort.page,
      perPage: filterAndSort.perPage,
      filterBy: { ...filter },
      sortBy: { [sort.field]: sort.direction },
    },
    onChange,
  };
}

export default useFilter;
