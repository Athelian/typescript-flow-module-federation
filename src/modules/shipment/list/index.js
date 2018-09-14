// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import ShipmentGridView from './ShipmentGridView';
import { shipmentListQuery } from './query';

type Props = {
  viewType: string,
  filter: {
    query: string,
    status: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

class ShipmentList extends React.PureComponent<Props> {
  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query
        query={shipmentListQuery}
        variables={{ page: 1, ...filtersAndSort }}
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
  }
}

export default ShipmentList;
