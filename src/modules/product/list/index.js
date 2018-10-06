// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import ProductGridView from './ProductGridView';
import { productListQuery } from './query';

type Props = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

const ProductList = ({ viewType, sort, ...filtersAndSort }: Props) => (
  <Query
    query={productListQuery}
    variables={{
      page: 1,
      sort: {
        [sort.field]: sort.direction,
      },
      ...filtersAndSort,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, refetch, variables, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'products.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'products.totalPage', data);
      const hasMore = nextPage <= totalPage;
      emitter.once('CHANGE_PRODUCT_STATUS', () => {
        refetch({
          ...variables,
          page: 1,
          perPage: getByPathWithDefault([], 'products.nodes', data).length,
        });
      });
      return (
        <ProductGridView
          items={getByPathWithDefault([], 'products.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'products')}
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default ProductList;
