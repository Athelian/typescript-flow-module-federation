// @flow
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { getShipmentViewStateQuery } from 'modules/shipment/query';
import { updateShipmentViewStateMutation } from 'modules/shipment/mutation';
import { encryptValue, decryptValue } from 'utils/cache';

type State = {
  filter: Object,
  page: number,
  perPage: number,
  sort: {
    field: string,
    direction: string,
  },
};

// only used at map view at the moment
function usePersistFilter(
  state: State = {
    filter: {},
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  },
  cacheKey: 'NRMOrder' | 'NRMShipment'
) {
  const client = useApolloClient();
  const localFilter = window.localStorage.getItem(cacheKey);
  const initialFilter = localFilter
    ? {
        ...state,
        ...JSON.parse(localFilter),
      }
    : state;

  const [filterAndSort, changeFilterAndSort] = useState(initialFilter);
  const [loading, setLoading] = useState(cacheKey === 'NRMShipment');

  useQuery(getShipmentViewStateQuery, {
    skip: cacheKey !== 'NRMShipment',
    variables: {
      type: 'ShipmentMap',
    },
    onCompleted: ({ viewState }) => {
      if (viewState.filterSort) {
        changeFilterAndSort(decryptValue(viewState.filterSort));
      }

      setLoading(false);
    },
  });

  const onChangeFilter = useCallback(
    (newFilter: Object) => {
      changeFilterAndSort(prevState => {
        const updatedFilter = {
          ...prevState,
          ...newFilter,
        };

        if (cacheKey === 'NRMShipment') {
          client.mutate({
            mutation: updateShipmentViewStateMutation,
            variables: {
              input: {
                name: 'zenport map view',
                type: 'ShipmentMap',
                filterSort: encryptValue(updatedFilter),
              },
            },
          });
        }

        return updatedFilter;
      });
    },
    [cacheKey, client]
  );

  useEffect(() => {
    if (window.localStorage) {
      const { filter, sort } = filterAndSort;
      window.localStorage.setItem(cacheKey, JSON.stringify({ filter, sort }));
    }
  }, [cacheKey, filterAndSort]);

  return {
    loading,
    filterAndSort,
    queryVariables: {
      page: filterAndSort?.page ?? 1,
      perPage: filterAndSort?.perPage ?? 10,
      filterBy: filterAndSort?.filter ?? {},
      sortBy: {
        [filterAndSort?.sort?.field ?? 'updatedAt']: filterAndSort?.sort?.direction ?? 'DESCENDING',
      },
    },
    onChangeFilter,
  };
}

export default usePersistFilter;
