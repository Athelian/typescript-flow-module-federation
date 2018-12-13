// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import ProductFocused from './productFocused';
import query from './productFocused/query';
import { QueryHandler } from './common';
import { SortFilter, SortFilterHandler } from './common/SortFilter';
import messages from './messages';

type Props = {
  intl: IntlShape,
  page: number,
  perPage: number,
};

const defaultProps = {
  page: 1,
  perPage: 10,
};

const Product = ({ page, perPage, intl }: Props) => (
  <SortFilterHandler>
    {({ sort, filter, onChangeSortFilter }) => (
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
          filterBy: { ...filter },
          sortBy: { [sort.field]: sort.direction },
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => (
          <>
            <SortFilter
              sort={sort}
              sortInputs={[
                {
                  title: intl.formatMessage(messages.productName),
                  value: 'name',
                },
                {
                  title: intl.formatMessage(messages.productSerial),
                  value: 'serial',
                },
                {
                  title: intl.formatMessage(messages.updatedAtSort),
                  value: 'updatedAt',
                },
                {
                  title: intl.formatMessage(messages.createdAtSort),
                  value: 'createdAt',
                },
              ]}
              filter={filter}
              onChange={newFilter => {
                onChangeSortFilter(newFilter);
              }}
              showTags={false}
            />
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
          </>
        )}
      </Query>
    )}
  </SortFilterHandler>
);

Product.defaultProps = defaultProps;

export default injectIntl(Product);
