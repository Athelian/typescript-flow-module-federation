// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import ProductGridView from './components/ProductGridView';
// import ProductListView from './components/ProductListView';
// import ProductTableView from './components/ProductTableView';
import { productListQuery } from './query';

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

class ProductList extends React.PureComponent<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.products.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.products.totalPage', data);
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
          getByPathWithDefault({}, 'viewer.products.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.products.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'viewer.products.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            products: {
              ...prevResult.viewer.products,
              ...getByPathWithDefault({}, 'viewer.products', fetchMoreResult),
              nodes: [
                ...prevResult.viewer.products.nodes,
                ...getByPathWithDefault([], 'viewer.products.nodes', fetchMoreResult),
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
        query={productListQuery}
        variables={{ page: 1, ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'viewer.products.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.products.totalPage', data);
          const hasMore = nextPage <= totalPage;

          if (viewType === 'list') return null;

          if (viewType === 'table') return null;

          return (
            <ProductGridView
              items={getByPathWithDefault([], 'viewer.products.nodes', data)}
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

export default ProductList;
