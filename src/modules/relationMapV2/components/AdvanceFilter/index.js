// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import { Filter, BulkHeaderFilter, Search } from 'components/NavBar';
import {
  OrderFilterConfig,
  ShipmentFilterConfig,
} from 'components/NavBar/components/Filter/configs';
import { SortAndFilter, FocusedView } from 'modules/relationMapV2/store';
import Icon from 'components/Icon';
import MatchesEntities from './components/MatchesEntities';
import { FilterWrapperStyle, BlueOutlineWrapperStyle, ClearTotalButtonStyle } from './style';

type Props = {
  bulkFilterType?: 'MAP',
};

export default function AdvanceFilter({ bulkFilterType }: Props) {
  const { selectors } = FocusedView.useContainer();
  const { filterAndSort, onChangeFilter, loading } = SortAndFilter.useContainer();
  const {
    filter: { query, ...filters },
  } = filterAndSort;
  const hasFilter = query !== '' || Object.keys(filterAndSort.filter).length > 1;
  const hasBulkFilter = bulkFilterType !== '';

  if (loading) {
    return null;
  }

  return (
    <div className={FilterWrapperStyle(hasFilter)}>
      <div className={BlueOutlineWrapperStyle(hasFilter)}>
        <Filter
          config={selectors.isOrderFocus ? OrderFilterConfig : ShipmentFilterConfig}
          filterBy={filters}
          onChange={filter => {
            if (!isEquals(filter, filters))
              onChangeFilter({
                ...filterAndSort,
                filter: {
                  ...filter,
                  query,
                },
              });
          }}
        />
        <Search
          query={query}
          onChange={newQuery =>
            onChangeFilter({
              ...filterAndSort,
              filter: {
                ...filterAndSort.filter,
                query: newQuery,
              },
            })
          }
        />

        {hasBulkFilter && (
          <BulkHeaderFilter
            filterBy={filters}
            setFilterBy={filter => {
              if (!isEquals(filter, filters))
                onChangeFilter({
                  ...filterAndSort,
                  filter: {
                    ...filter,
                    query,
                  },
                });
            }}
            type={bulkFilterType}
          />
        )}
      </div>

      {hasFilter && <MatchesEntities />}

      {hasFilter && (
        <button
          className={ClearTotalButtonStyle}
          onClick={() => {
            onChangeFilter({
              ...filterAndSort,
              filter: {
                query: '',
              },
            });
          }}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      )}
    </div>
  );
}
