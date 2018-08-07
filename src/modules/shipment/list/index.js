// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import ShipmentGridView from './components/ShipmentGridView';
import ShipmentListView from './components/ShipmentListView';
import ShipmentTableView from './components/ShipmentTableView';
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

class OrderList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.shipments.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.shipments.totalPage', data);
    if (nextPage > totalPage) return;

    const { viewType, ...filtersAndSort } = this.props;
    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (getByPathWithDefault([], 'viewer.shipments.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            shipments: {
              ...prevResult.viewer.shipments,
              ...getByPathWithDefault({}, 'viewer.shipments', fetchMoreResult),
              nodes: [
                ...prevResult.viewer.shipments.nodes,
                ...getByPathWithDefault([], 'viewer.shipments.nodes', fetchMoreResult),
              ],
            },
          },
        };
      },
    });
  };

  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query query={shipmentListQuery} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.shipments.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.shipments.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <ShipmentListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.shipments.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <ShipmentTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.shipments.nodes', data)}
              />
            );

          return (
            <ShipmentGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.shipments.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default OrderList;
