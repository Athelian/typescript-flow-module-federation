// @flow
import React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { StringValue } from 'react-values';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';

import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader, SelectInputFactory, Label } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';

import RelatedGridView from './RelatedGridView';
import { SectionWrapperStyle, SectionBodyStyle, SelectRelatedTypeWrapperStyle } from './style';
import { getRelatedQuery } from './helpers';

type Props = {
  intl: IntlShape,
  id: string,
};

const RelatedSection = ({ intl, id }: Props) => {
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
    <StringValue defaultValue="orders">
      {({ value: relatedType, set: changeRelatedType }) => {
        const query = getRelatedQuery(relatedType);

        return (
          <Query query={query} variables={filtersAndSort} fetchPolicy="network-only">
            {({ loading, data, error, fetchMore }) => {
              if (error) {
                return error.message;
              }

              const nextPage = getByPathWithDefault(1, `${relatedType}.page`, data) + 1;
              const totalPage = getByPathWithDefault(1, `${relatedType}.totalPage`, data);
              const hasMore = nextPage <= totalPage;

              const items = getByPathWithDefault([], `${relatedType}.nodes`, data);
              const totalCount = getByPathWithDefault(0, `${relatedType}.totalCount`, data);

              return (
                <SectionWrapper id="product_relatedSection">
                  <SectionHeader
                    icon="RELATED"
                    title={
                      <FormattedMessage id="modules.Products.related" defaultMessage="RELATED" />
                    }
                  />

                  <div className={SectionWrapperStyle}>
                    <SectionNavBar>
                      <div className={SelectRelatedTypeWrapperStyle}>
                        <SelectInputFactory
                          value={relatedType}
                          items={[
                            {
                              label: intl.formatMessage({
                                id: 'modules.Products.orders',
                                defaultMessage: 'Orders',
                              }),
                              value: 'orders',
                            },
                            {
                              label: intl.formatMessage({
                                id: 'modules.Products.items',
                                defaultMessage: 'Items',
                              }),
                              value: 'orderItems',
                            },
                            {
                              label: intl.formatMessage({
                                id: 'modules.Products.batches',
                                defaultMessage: 'Batches',
                              }),
                              value: 'batches',
                            },
                            {
                              label: intl.formatMessage({
                                id: 'modules.Products.containers',
                                defaultMessage: 'Containers',
                              }),
                              value: 'containers',
                            },
                            {
                              label: intl.formatMessage({
                                id: 'modules.Products.shipments',
                                defaultMessage: 'Shipments',
                              }),
                              value: 'shipments',
                            },
                          ]}
                          inputWidth="100px"
                          hideTooltip
                          onChange={evt => {
                            changeRelatedType(evt.target.value);
                          }}
                          editable
                          inputAlign="left"
                          required
                          forceHoverStyle
                        />
                        <Label align="left">
                          {' ('}
                          <FormattedNumber value={totalCount} />
                          {')'}
                        </Label>
                      </div>
                    </SectionNavBar>
                    <div className={SectionBodyStyle(totalCount)}>
                      <RelatedGridView
                        relatedType={relatedType}
                        items={items}
                        onLoadMore={() =>
                          loadMore({ fetchMore, data }, filtersAndSort, relatedType)
                        }
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
      }}
    </StringValue>
  );
};

export default injectIntl(RelatedSection);
