// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { WAREHOUSE_CREATE } from 'modules/permission/constants/warehouse';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  WarehouseFilterConfig,
  WarehouseSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import { useViewerHasPermissions } from 'contexts/Permissions';
import useFilterSort from 'hooks/useFilterSort';
import WarehouseList from './list';

const WarehouseListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'warehouse_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" subIcon="CARDS" />

        <Filter config={WarehouseFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={WarehouseSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(WAREHOUSE_CREATE) && (
          // $FlowFixMe Flow typed is not updated yet
          <Link to="/warehouse/new">
            <NewButton />
          </Link>
        )}
      </NavBar>
      <WarehouseList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default WarehouseListModule;
