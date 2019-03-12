// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { usePrevious } from 'modules/form/hooks';
import apolloClient from 'apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import OrderGridView from './OrderGridView';
import { orderListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const OrderList = ({ ...filtersAndSort }: Props) => {
  const lastFilter = usePrevious(filtersAndSort);
  const [isReady, setIsReady] = React.useState(true);
  React.useEffect(() => {
    if (!isEquals(lastFilter, filtersAndSort)) {
      logger.warn('re-render', isReady);
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
