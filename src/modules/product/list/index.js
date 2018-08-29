// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import ProductGridView from './ProductGridView';
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
    const nextPage = getByPathWithDefault(1, 'products.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'products.totalPage', data);
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
          getByPathWithDefault({}, 'products.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'products.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'products.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          products: {
            ...prevResult.products,
            ...getByPathWithDefault({}, 'products', fetchMoreResult),
            nodes: [
              ...prevResult.products.nodes,
              ...getByPathWithDefault([], 'products.nodes', fetchMoreResult),
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
        query={productListQuery}
        variables={{ page: 1, ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'products.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'products.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <ProductGridView
              items={getByPathWithDefault([], 'products.nodes', data)}
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
