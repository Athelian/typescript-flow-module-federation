// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { usePrevious } from 'modules/form/hooks';
import apolloClient from 'apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import OrderGridView from './OrderGridView';
import { orderListQuery } from './query';

type Props = {};

const OrderList = ({ ...filtersAndSort }: Props) => {
  const lastFilter = usePrevious(filtersAndSort);
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    if (!isEquals(lastFilter, filtersAndSort)) {
      if (isReady) {
        setIsReady(false);
      }
    } else if (!isReady) {
      setIsReady(true);
    }
    emitter.once('CHANGE_ORDER_STATUS', () => {
      apolloClient.reFetchObservableQueries();
    });
  });

  return (
    <Query query={orderListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <OrderGridView
            items={getByPathWithDefault([], 'orders.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orders')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default OrderList;
