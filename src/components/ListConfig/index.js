// @flow
import * as React from 'react';
import useFilter from 'modules/relationMapBeta/hooks/useFilter';

const { useEffect, useCallback } = React;
type Props = {
  initFilter: Object,
  filterName: string,
  children: React.Node,
};

const ListConfigContext: React.Context<Object> = React.createContext();

export const useListConfig = (
  initFilter: Object,
  filterName: string,
  option?: Object = {
    appliedLocalFilter: true,
    saveLocalFilter: true,
  }
) => {
  const { filterAndSort, queryVariables, onChange } = useFilter(initFilter);
  useEffect(() => {
    const localFilter = window.localStorage && window.localStorage.getItem(filterName);
    if (localFilter && option.appliedLocalFilter) {
      onChange({ ...JSON.parse(localFilter) });
    }
  }, []);
  const onChangeFilter = useCallback(
    (newFilter: Object) => {
      onChange(newFilter);
      if (window.localStorage && option.saveLocalFilter) {
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

const ListConfigProvider = (props: Props) => {
  const { children, initFilter, filterName } = props;
  const { filterAndSort, queryVariables, onChangeFilter } = useListConfig(initFilter, filterName);
  return (
    <ListConfigContext.Provider value={{ filterAndSort, queryVariables, onChangeFilter }}>
      {children}
    </ListConfigContext.Provider>
  );
};

export const ListConfigConsumer = ListConfigContext.Consumer;
export default ListConfigProvider;
