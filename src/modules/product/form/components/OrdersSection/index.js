// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import OrderGridView from './OrderGridView';
import { ordersInProductQuery } from './query';
import { SectionWrapperStyle, SectionBodyStyle } from './style';

type Props = {
  id: string,
};

const OrdersSection = ({ id }: Props) => {
  const filtersAndSort = {
    filterBy: {
      productId: id,
    },
    sortBy: {
      updatedAt: 'DESCENDING',
    },
    perPage: 10,
    page: 1,
  };

  return (
    <Query query={ordersInProductQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <SectionWrapper id="product_ordersSection">
            <SectionHeader
              icon="ORDER"
              title={
                <>
                  <FormattedMessage id="modules.Products.orders" defaultMessage="ORDERS" /> (
                  <FormattedNumber value={getByPathWithDefault(0, 'orders.totalCount', data)} />)
                </>
              }
            />

            <div className={SectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortandfilterswip" />
              </SectionNavBar>
              <div className={SectionBodyStyle}>
                <OrderGridView
                  items={getByPathWithDefault([], 'orders.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orders')}
                  hasMore={hasMore}
                  isLoading={loading}
                />
              </div>
            </div>
          </SectionWrapper>
        );
      }}
    </Query>
  );
};

export default OrdersSection;
