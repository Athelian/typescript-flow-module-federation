// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import messages from 'modules/relationMap/messages';
import ProductFocused from './productFocused';
import query from './productFocused/query';
import Layout from './common/Layout';
import QueryHandler from './common/QueryHandler';
import SortFilterBar from './common/SortFilterBar';
import { FunctionWrapperStyle } from './style';

type Props = {
  page: number,
  perPage: number,
  intl: IntlShape,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const Product = ({ page, perPage, intl }: Props) => {
  const sortInput = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    { title: intl.formatMessage(messages.nameSort), value: 'name' },
    { title: intl.formatMessage(messages.serialSort), value: 'serial' },
  ];

  return (
    <Layout>
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
    </Layout>
  );
};
Product.defaultProps = defaultProps;
export default injectIntl(Product);
