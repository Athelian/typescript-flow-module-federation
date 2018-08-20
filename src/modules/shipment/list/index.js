// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import ShipmentGridView from './components/ShipmentGridView';
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
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
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
        const { filter, sort, perPage } = this.props;
        if (
          !isEquals({ filter, sort, perPage }, filtersAndSort) ||
          getByPathWithDefault({}, 'viewer.shipments.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.shipments.page', fetchMoreResult)
        ) {
          return prevResult;
        }

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
      <Query
        query={shipmentListQuery}
        variables={{ page: 1, ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'viewer.shipments.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.shipments.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <ShipmentGridView
              items={getByPathWithDefault([], 'viewer.shipments.nodes', data)}
              onLoadMore={() => this.loadMore({ fetchMore, data })}
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
