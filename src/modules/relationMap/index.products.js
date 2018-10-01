// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import ProductFocused from './components/ProductFocused';
import Layout from './components/Layout';
import QueryHandler from './components/QueryHandler';
import SortFilterBar from './components/SortFilterBar';
import query from './components/ProductFocused/query';
import { FunctionWrapperStyle, ProductWrapper } from './style';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};
// temporary func before get real query
const formatData = data =>
  data.map(product => {
    const name = getByPathWithDefault('', 'productProvider.product.name', product);
    const serial = getByPathWithDefault('', 'productProvider.product.serial', product);
    return { ...product, name, serial };
  });

const Product = ({ page, perPage }: Props) => (
  <Layout>
    <div className={ProductWrapper}>
      <SortFilterBar className={FunctionWrapperStyle}>
        {({ sort, filter }) => (
          <Query
            query={query}
            variables={{
              page,
              perPage,
              filterBy: {
                query: filter,
              },
              sortBy: {
                [sort.field]: sort.direction,
              },
            }}
            fetchPolicy="network-only"
          >
            {({ loading, data, fetchMore, error }) => (
              <QueryHandler
                model="orderItems"
                loading={loading}
                data={data}
                fetchMore={fetchMore}
                error={error}
              >
                {({ nodes, hasMore, loadMore }) => {
                  const items = formatData(nodes);
                  return <ProductFocused hasMore={hasMore} loadMore={loadMore} items={items} />;
                }}
              </QueryHandler>
            )}
          </Query>
        )}
      </SortFilterBar>
    </div>
  </Layout>
);
Product.defaultProps = defaultProps;
export default Product;
