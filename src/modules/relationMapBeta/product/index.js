// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { useFilter } from 'modules/relationMapBeta/hooks';
import { SortFilter } from 'modules/relationMap/common/SortFilter';
import { QueryHandler } from 'modules/relationMap/common';
import ProductFocused from 'modules/relationMap/productFocused';
import messages from 'modules/relationMap/messages';
import query from './query';

type Props = {
  intl: IntlShape,
};

function Product(props: Props) {
  const { intl } = props;
  const { queryVariables, filterAndSort, onChange } = useFilter({
    page: 1,
    perPage: 10,
    batchPage: 1,
    batchPerPage: 100,
    batchSort: {
      deliveredAt: 'DESCENDING',
    },
    filter: {
      archived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  });
  return (
    <Query query={query} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => (
        <>
          <SortFilter
            sort={filterAndSort.sort}
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
            filter={filterAndSort.filter}
            onChange={onChange}
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
  );
}

export default injectIntl(Product);
