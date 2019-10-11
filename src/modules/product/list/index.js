// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import type { FilterBy, SortBy } from 'types';
import ProductGridView from './ProductGridView';
import { productListQuery } from './query';

type Props = {
  filterBy: FilterBy,
  sortBy: SortBy,
  perPage: number,
};

const ProductList = ({ ...filtersAndSort }: Props) => {
  React.useEffect(() => {
    emitter.once('CHANGE_PRODUCT_STATUS', () => {
      apolloClient.reFetchObservableQueries();
    });
  });

  return (
    <Query query={productListQuery} variables={filtersAndSort} fetchPolicy="network-only">
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
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'products')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default ProductList;
