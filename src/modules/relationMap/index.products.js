// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import ProductFocused from './productFocused';
import query from './productFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SortFilterBar from './common/SortFilterBar';
import { FunctionWrapperStyle, ProductWrapper } from './style';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const sortInput = [
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Name', value: 'name' },
  { title: 'Serial', value: 'serial' },
];
const Product = ({ page, perPage }: Props) => (
  <Layout>
    <div className={ProductWrapper}>
      <SortFilterBar className={FunctionWrapperStyle} sortInput={sortInput}>
        {({ sort, filter }) => (
          <Query
            query={query}
            variables={{
              page,
              perPage,
              batchPage: 1,
              batchPerPage: 100,
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
                model="products"
                loading={loading}
                data={data}
                fetchMore={fetchMore}
                error={error}
              >
                {({ nodes, hasMore, loadMore }) => (
                  <ProductFocused hasMore={hasMore} loadMore={loadMore} items={nodes} />
                )}
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
