// @flow
import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import ItemGridView from './ItemGridView';

import { itemsInProductQuery } from './query';
import { SectionWrapperStyle, SectionBodyStyle } from './style';

type Props = {
  id: string,
};

const ItemsSection = ({ id }: Props) => {
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
    <Query query={itemsInProductQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'orderItems.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <SectionWrapper id="product_itemsSection">
            <SectionHeader
              icon="ORDER_ITEM"
              title={
                <>
                  <FormattedMessage id="modules.Products.items" defaultMessage="ITEMS" /> (
                  <FormattedNumber value={getByPathWithDefault(0, 'orderItems.totalCount', data)} />
                  )
                </>
              }
            />

            <div className={SectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortandfilterswip" />
              </SectionNavBar>
              <div className={SectionBodyStyle}>
                <ItemGridView
                  items={getByPathWithDefault([], 'orderItems.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
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

export default ItemsSection;
