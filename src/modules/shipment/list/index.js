// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
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

class ShipmentList extends React.Component<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
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
          getByPathWithDefault({}, 'shipments.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'shipments.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'shipments.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          shipments: {
            ...prevResult.shipments,
            ...getByPathWithDefault({}, 'shipments', fetchMoreResult),
            nodes: [
              ...prevResult.shipments.nodes,
              ...getByPathWithDefault([], 'shipments.nodes', fetchMoreResult),
            ],
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

          const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <ShipmentGridView
              items={getByPathWithDefault([], 'shipments.nodes', data)}
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
