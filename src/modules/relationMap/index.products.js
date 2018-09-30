// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import ProductFocused from './components/ProductFocused';
import Layout from './components/Layout';
import QueryHandler from './components/QueryHandler';
import SortFilterBar from './components/SortFilterBar';
import ToggleTag from './components/ToggleTag';
import query from './components/ProductFocused/query';
import { FunctionWrapperStyle, TagWrapperStyle } from './style';

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
    <div className={TagWrapperStyle}>
      <ToggleTag />
    </div>
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
                const products = formatData(nodes);
                return <ProductFocused hasMore={hasMore} loadMore={loadMore} nodes={products} />;
              }}
            </QueryHandler>
          )}
        </Query>
      )}
    </SortFilterBar>
  </Layout>
);
Product.defaultProps = defaultProps;
export default Product;
