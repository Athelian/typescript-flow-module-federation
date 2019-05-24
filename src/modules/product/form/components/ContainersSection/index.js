// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import ContainerGridView from './ContainerGridView';
import { containersInProductQuery } from './query';
import { SectionWrapperStyle, SectionBodyStyle } from './style';

type Props = {
  id: string,
};

const ContainersSection = ({ id }: Props) => {
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
    <Query query={containersInProductQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'containers.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'containers.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <SectionWrapper id="product_containersSection">
            <SectionHeader
              icon="BATCH"
              title={
                <>
                  <FormattedMessage id="modules.Products.containers" defaultMessage="CONTAINERS" />{' '}
                  (
                  <FormattedNumber value={getByPathWithDefault(0, 'containers.totalCount', data)} />
                  )
                </>
              }
            />

            <div className={SectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortandfilterswip" />
              </SectionNavBar>
              <div className={SectionBodyStyle}>
                <ContainerGridView
                  items={getByPathWithDefault([], 'containers.nodes', data)}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'containers')}
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

export default ContainersSection;
