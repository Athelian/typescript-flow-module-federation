// @flow
import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import BatchGridView from './BatchGridView';

import { batchesInProductQuery } from './query';
import { SectionWrapperStyle, SectionBodyStyle } from './style';

type Props = {
  id: string,
};

const BatchesSection = ({ id }: Props) => {
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
    <Query query={batchesInProductQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <SectionWrapper id="product_batchesSection">
            <SectionHeader
              icon="BATCH"
              title={
                <>
                  <FormattedMessage id="modules.Products.batches" defaultMessage="BATCHES" /> (
                  <FormattedNumber value={getByPathWithDefault(0, 'batches.totalCount', data)} />)
                </>
              }
            />

            <div className={SectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortandfilterswip" />
              </SectionNavBar>
              <div className={SectionBodyStyle}>
                <BatchGridView
                  items={getByPathWithDefault([], 'batches.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'batches')}
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

export default BatchesSection;
