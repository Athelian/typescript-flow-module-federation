// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'apollo';
import { usePrevious } from 'modules/form/hooks';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import emitter from 'utils/emitter';
import ProductGridView from './ProductGridView';
import { productListQuery } from './query';

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

const ProductList = ({ ...filtersAndSort }: Props) => {
  const lastFilter = usePrevious(filtersAndSort);
  const [isReady, setIsReady] = React.useState(true);
  React.useEffect(() => {
    if (!isEquals(lastFilter, filtersAndSort)) {
      logger.warn('re-render');
      if (isReady) {
        setIsReady(false);
      }
    } else if (!isReady) {
      setIsReady(true);
    }
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
