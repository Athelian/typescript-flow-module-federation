// @flow
import * as React from 'react';
import Filter from 'components/NavBar/components/Filter';
import { SearchInput } from 'components/NavBar';
import { SortAndFilter } from 'modules/relationMapV2/store';
import MatchesEntities from './components/MatchesEntities';

export default function AdvanceFilter() {
  const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
  const {
    filter: { query, ...filters },
  } = filterAndSort;
  return (
    <>
      <Filter
        // TODO: need to add more fields after the component is ready
        config={[{ entity: 'ORDER', field: 'archived', type: 'archived', defaultValue: false }]}
        filters={filters}
        onChange={filter =>
          onChangeFilter({
            ...filterAndSort,
            filter: {
              ...filter,
              query,
            },
          })
        }
      />
      <SearchInput
        value={filterAndSort.query}
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
      {(filterAndSort.filter.query !== '' || Object.keys(filterAndSort.filter).length > 1) && (
        <MatchesEntities />
      )}
    </>
  );
}
