// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { usePrevious } from 'modules/form/hooks';
import apolloClient from 'apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import emitter from 'utils/emitter';
import ShipmentGridView from './ShipmentGridView';
import { shipmentListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

const ShipmentList = ({ ...filtersAndSort }: Props) => {
  const lastFilter = usePrevious(filtersAndSort);
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    if (!isEquals(lastFilter, filtersAndSort)) {
      logger.warn('re-render');
      if (isReady) {
        setIsReady(false);
      }
    } else if (!isReady) {
      setIsReady(true);
    }
    emitter.once('CHANGE_SHIPMENT_STATUS', () => {
      apolloClient.reFetchObservableQueries();
    });
  });

  return (
    <Query
      query={shipmentListQuery}
      variables={{
        page: 1,
        ...filtersAndSort,
      }}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ShipmentGridView
            items={getByPathWithDefault([], 'shipments.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'shipments')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default ShipmentList;
