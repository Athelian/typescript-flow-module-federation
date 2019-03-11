// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import useFilter from 'hooks/useFilter';
import SortFilter from 'modules/relationMap/common/SortFilter';
import messages from 'modules/relationMap/messages';
import LoadingIcon from 'components/LoadingIcon';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import ProductFocused from './ProductFocused';
import query from './query';
import { hasMoreItems } from '../order/helpers';

type Props = {
  intl: IntlShape,
};

function Product(props: Props) {
  const { intl } = props;
  const { queryVariables, filterAndSort, onChangeFilter } = useFilter(
    {
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
    },
    'productFocusFilter'
  );
  return (
    <Query query={query} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        return (
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
              onChange={onChangeFilter}
              showTags={false}
            />
            {loading ? (
              <LoadingIcon />
            ) : (
              <ProductFocused
                hasMore={hasMoreItems(data)}
                loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'products')}
                items={getByPathWithDefault([], `products.nodes`, data)}
              />
            )}
          </>
        );
      }}
    </Query>
  );
}

export default injectIntl(Product);
