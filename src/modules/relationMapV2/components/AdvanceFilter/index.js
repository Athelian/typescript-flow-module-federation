// @flow
import * as React from 'react';
import Filter from 'components/NavBar/components/Filter';
import { SearchInput } from 'components/NavBar';
import { SortAndFilter } from 'modules/relationMapV2/store';
import MatchesEntities from './components/MatchesEntities';

export default function AdvanceFilter() {
  const { filterAndSort, onChangeFilter } = SortAndFilter.useContainer();
  return (
    <>
      <Filter
        // TODO: need to add more fields after the component is ready
        config={[{ entity: 'ORDER', field: 'archived', type: 'archived', defaultValue: false }]}
        filters={filterAndSort}
        onChange={filter =>
          onChangeFilter({
            ...filterAndSort,
            filter: {
              ...filter,
              query: filterAndSort.filter.query,
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
        onChange={query =>
          onChangeFilter({
            ...filterAndSort,
            filter: {
              ...filterAndSort.filter,
              query,
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
