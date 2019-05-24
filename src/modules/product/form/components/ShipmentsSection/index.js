// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import ShipmentGridView from './ShipmentGridView';
import { shipmentsInProductQuery } from './query';
import { SectionWrapperStyle, SectionBodyStyle } from './style';

type Props = {
  id: string,
};

const ShipmentsSection = ({ id }: Props) => {
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
    <Query query={shipmentsInProductQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'shipments.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'shipments.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <SectionWrapper id="product_shipmentsSection">
            <SectionHeader
              icon="SHIPMENT"
              title={
                <>
                  <FormattedMessage id="modules.Products.shipments" defaultMessage="SHIPMENTS" /> (
                  <FormattedNumber value={getByPathWithDefault(0, 'shipments.totalCount', data)} />)
                </>
              }
            />

            <div className={SectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortandfilterswip" />
              </SectionNavBar>
              <div className={SectionBodyStyle}>
                <ShipmentGridView
                  items={getByPathWithDefault([], 'shipments.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'shipments')}
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

export default ShipmentsSection;
