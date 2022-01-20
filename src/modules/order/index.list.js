// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { Content } from 'components/Layout';
import { NewButton, ExportButton } from 'components/Buttons';
import {
  BulkHeaderFilter,
  NavBar,
  EntityIcon,
  Filter,
  Sort,
  Search,
  OrderFilterConfig,
  OrderSortConfig,
} from 'components/NavBar';
import { useViewerHasPermissions } from 'contexts/Permissions';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import useFilterSort from 'hooks/useFilterSort';
import OrderList from './list';
import { ordersExportQuery } from './query';

const OrderModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'order_cards'
  );

  const hasPermissions = useViewerHasPermissions();

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="ORDER" color="ORDER" subIcon="CARDS" />

        <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <BulkHeaderFilter filterBy={filterBy} setFilterBy={filterBy} type="ORDER" />
        <Sort config={OrderSortConfig} sortBy={sortBy} onChange={setSortBy} />

        {hasPermissions(ORDER_CREATE) && (
          // $FlowFixMe Flow typed is not updated yet
          <Link to="/order/new">
            <NewButton />
          </Link>
        )}
        <ExportButton
          type="Orders"
          exportQuery={ordersExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
          }}
        />
      </NavBar>
      <OrderList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default OrderModule;
