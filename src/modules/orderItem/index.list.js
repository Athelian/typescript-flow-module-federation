// @flow
import * as React from 'react';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  OrderItemFilterConfig,
  OrderItemSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import OrderItemList from './list';

const OrderItemListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'order_item_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" subIcon="CARDS" />

        <Filter config={OrderItemFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={OrderItemSortConfig} sortBy={sortBy} onChange={setSortBy} />
      </NavBar>
      <OrderItemList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default OrderItemListModule;
