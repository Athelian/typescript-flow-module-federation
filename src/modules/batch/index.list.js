// @flow
import * as React from 'react';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  BatchFilterConfig,
  BatchSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import BatchList from './list';

const BatchListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'batch_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="BATCH" color="BATCH" subIcon="CARDS" />

        <Filter config={BatchFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={BatchSortConfig} sortBy={sortBy} onChange={setSortBy} />
      </NavBar>
      <BatchList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default BatchListModule;
