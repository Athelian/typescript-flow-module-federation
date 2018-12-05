// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import ProductFocused from './productFocused';
import query from './productFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';

type Props = {
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const Product = ({ page, perPage }: Props) => (
  <Layout>
    <Query
      query={query}
      variables={{
        page,
        perPage,
        batchPage: 1,
        batchPerPage: 100,
        batchSort: {
          deliveredAt: 'DESCENDING',
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
  </Layout>
);
Product.defaultProps = defaultProps;
export default injectIntl(Product);
