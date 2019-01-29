// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import ShipmentGridView from './ShipmentGridView';
import { shipmentListQuery } from './query';

type Props = {
  viewType: string,
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

class ShipmentList extends React.PureComponent<Props> {
  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query
        query={shipmentListQuery}
        variables={{
          page: 1,
          ...filtersAndSort,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error, refetch }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
          const hasMore = nextPage <= totalPage;

          emitter.once('CHANGE_SHIPMENT_STATUS', () => {
            // TODO: after the mutation, it's not ready on data yet
            refetch();
          });

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
  }
}

export default ShipmentList;
