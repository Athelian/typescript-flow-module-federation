// @flow
import React from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { GenericNavBar, ProductSortConfig, Search, Sort } from 'components/NavBar';
import useFilterSort from 'hooks/useFilterSort';
import DetailFocused from 'modules/relationMap/common/SlideForm';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { hasMoreItems } from '../order/helpers';
import ProductFocused from './ProductFocused';
import productQuery from './query';
import {
  ProductListWrapperStyle,
  WrapperStyle,
  GroupFilterWrapperStyle,
  SortFilterWrapperStyle,
  SortWrapperStyle,
} from './style';

function Product() {
  const { query, filterBy, sortBy, setQuery, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'productFocusFilter'
  );

  const queryVariables = {
    batchPage: 1,
    batchPerPage: 100,
    batchSort: {
      deliveredAt: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
    filterBy: { query, ...filterBy },
    sortBy,
  };

  return (
    <Query query={productQuery} variables={queryVariables} fetchPolicy="no-cache">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        if (loading) {
          return <LoadingIcon />;
        }

        return (
          <>
            <GenericNavBar>
              <div className={SortFilterWrapperStyle}>
                <div className={SortWrapperStyle}>
                  <Sort config={ProductSortConfig} sortBy={sortBy} onChange={setSortBy} />
                </div>
                <div className={GroupFilterWrapperStyle}>
                  <Search query={query} onChange={setQuery} />
                </div>
              </div>
            </GenericNavBar>

            <div className={WrapperStyle}>
              <InfiniteScroll
                className={ProductListWrapperStyle}
                loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'products')}
                hasMore={hasMoreItems(data, 'products')}
                loader={<LoadingIcon key="loading" />}
                useWindow={false}
                threshold={500}
              >
                <ProductFocused items={getByPathWithDefault([], `products.nodes`, data)} />
              </InfiniteScroll>
            </div>

            <DetailFocused />
          </>
        );
      }}
    </Query>
  );
}

export default Product;
