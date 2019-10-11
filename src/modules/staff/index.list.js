// @flow
import * as React from 'react';
import { Content } from 'components/Layout';
import {
  UserFilterConfig,
  UserSortConfig,
  EntityIcon,
  Filter,
  NavBar,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import StaffList from './list';

const StaffModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'staff_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="STAFF" color="STAFF" />

        <Filter config={UserFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={UserSortConfig} sortBy={sortBy} onChange={setSortBy} />
      </NavBar>
      <StaffList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default StaffModule;
