// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import loadMore from 'utils/loadMore';
import { Content, SlideViewNavBar } from 'components/Layout';
import OrderGridView from 'modules/order/list/OrderGridView';
import {
  EntityIcon,
  Filter,
  Search,
  Sort,
  OrderFilterConfig,
  OrderSortConfig,
} from 'components/NavBar';
import { getByPathWithDefault } from 'utils/fp';
import { isForbidden, isNotFound } from 'utils/data';
import useFilterSort from 'hooks/useFilterSort';
import { OrderCard } from 'components/Cards';
import { CancelButton } from 'components/Buttons';
import { orderListQuery } from './query';

type OptionalProps = {
  cacheKey: string,
  isLoading?: boolean,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
};

function SelectOrders({ cacheKey, isLoading = false, onCancel, onSelect }: Props) {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    cacheKey
  );

  const variables = {
    filterBy: { query, ...filterBy },
    sortBy,
    page: 1,
    perPage: 10,
  };

  const { loading, data, fetchMore, error } = useQuery(orderListQuery, {
    fetchPolicy: 'network-only',
    variables,
  });

  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const onSelectOrder = React.useCallback(
    (order: Object) => {
      setSelectedOrder(order);
      if (onSelect) {
        onSelect(order);
      }
    },
    [onSelect]
  );

  const orders = React.useMemo(() => {
    return getByPathWithDefault([], 'orders.nodes', data).filter(
      order => !isForbidden(order) && !isNotFound(order)
    );
  }, [data]);

  if (error) {
    return error.message;
  }

  const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
  const hasMore = nextPage <= totalPage;

  return (
    <>
      <SlideViewNavBar isSubNavBar>
        <EntityIcon icon="ORDER" color="ORDER" subIcon="CARDS" />

        <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={OrderSortConfig} sortBy={sortBy} onChange={setSortBy} />

        <CancelButton disabled={isLoading} onClick={onCancel} />
      </SlideViewNavBar>

      <Content hasSubNavBar>
        <OrderGridView
          items={orders}
          onLoadMore={() => loadMore({ fetchMore, data }, variables, 'orders')}
          hasMore={hasMore}
          isLoading={loading}
          renderItem={item => {
            return (
              <OrderCard
                key={item.id}
                order={item}
                selectable
                selected={selectedOrder?.id === item.id}
                onSelect={onSelectOrder}
              />
            );
          }}
        />
      </Content>
    </>
  );
}

const defaultProps = {
  cacheKey: 'SelectOrders',
};

SelectOrders.defaultProps = defaultProps;

export default SelectOrders;
