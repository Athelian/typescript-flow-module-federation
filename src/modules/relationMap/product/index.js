// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import InfiniteScroll from 'react-infinite-scroller';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import useFilter from 'hooks/useFilter';
import DetailFocused from 'modules/relationMap/common/SlideForm';
import SortFilter from 'modules/relationMap/common/SortFilter';
import messages from 'modules/relationMap/messages';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { ProductListWrapperStyle, WrapperStyle } from './style';
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
    <Query
      query={query}
      variables={{
        batchPage: 1,
        batchPerPage: 100,
        batchSort: {
          deliveredAt: 'DESCENDING',
        },
        ...queryVariables,
      }}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        if (loading) {
          return <LoadingIcon />;
        }

        return (
          <>
            <SortFilter
              sort={filterAndSort.sort}
              sortInputs={[
                { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
                { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
                { title: intl.formatMessage(messages.name), value: 'name' },
                { title: intl.formatMessage(messages.serial), value: 'serial' },
              ]}
              filter={filterAndSort.filter}
              onChange={onChangeFilter}
              showTags={false}
            />
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

export default injectIntl(Product);
