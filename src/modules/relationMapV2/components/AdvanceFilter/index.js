// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import Filter from 'components/NavBar/components/Filter';
import {
  OrderFilterConfig,
  ShipmentFilterConfig,
} from 'components/NavBar/components/Filter/configs';
import { SearchInput } from 'components/NavBar';
import { SortAndFilter, FocusedView } from 'modules/relationMapV2/store';
import Icon from 'components/Icon';
import MatchesEntities from './components/MatchesEntities';
import { FilterWrapperStyle, BlueOutlineWrapperStyle, ClearTotalButtonStyle } from './style';

export default function AdvanceFilter() {
  const { selectors } = FocusedView.useContainer();
  const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
  const {
    filter: { query, ...filters },
  } = filterAndSort;
  const hasFilter = query !== '' || Object.keys(filterAndSort.filter).length > 1;

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
        <SearchInput
          key={JSON.stringify({ query })}
          value={query}
          name="search"
          onClear={() =>
            onChangeFilter({
              ...filterAndSort,
              filter: {
                ...filterAndSort.filter,
                query: '',
              },
            })
          }
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
