// @flow
import { useCallback } from 'react';
import useFilter from 'modules/relationMap/hooks/useFilter';

const useListConfig = (initFilter: Object, filterName: string) => {
  const localFilter = window.localStorage.getItem(filterName);
  const initialFilter = localFilter
    ? {
        ...initFilter,
        ...JSON.parse(localFilter),
      }
    : initFilter;
  const { filterAndSort, queryVariables, onChange } = useFilter(initialFilter);
  const onChangeFilter = useCallback(
    (newFilter: Object) => {
      onChange(newFilter);
      // @TODO need to handle if brower is not support localstorage
      if (window.localStorage) {
        window.localStorage.setItem(
          filterName,
          JSON.stringify({
            ...filterAndSort,
            ...newFilter,
          })
        );
      }
    },
    [filterAndSort]
  );
  return { filterAndSort, queryVariables, onChangeFilter };
};

export default useListConfig;
