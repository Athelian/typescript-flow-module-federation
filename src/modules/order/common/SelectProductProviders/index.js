// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { removeTypename } from 'utils/data';
import GridView from 'components/GridView';
import useFilter from 'hooks/useFilter';
import FilterToolBar from 'components/common/FilterToolBar';
import IncrementInput from 'components/IncrementInput';
import { Content, SlideViewLayout } from 'components/Layout';
import { Label, Display } from 'components/Form';
import { OrderProductProviderCard } from 'components/Cards';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import type { OrderItem } from 'modules/order/type.js.flow';
import { productProvidersListQuery } from './query';
import { ItemWrapperStyle } from './style';

type OptionalProps = {
  importerId: string,
  exporterId: string,
  orderCurrency: string,
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
};

const defaultProps = {
  importerId: '',
  exporterId: '',
  orderCurrency: '',
  cacheKey: 'SelectProductProviders',
};

const countSelected = (selected: Array<OrderItem> = [], value: OrderItem) =>
  selected.filter(item => item.id === value.id).length;

function SelectProductProviders({
  intl,
  onCancel,
  onSelect,
  importerId,
  exporterId,
  orderCurrency,
  cacheKey,
}: Props) {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    { title: intl.formatMessage(messages.endProductName), value: 'name' },
    { title: intl.formatMessage(messages.productName), value: 'productName' },
    { title: intl.formatMessage(messages.productSerial), value: 'productSerial' },
    { title: intl.formatMessage(messages.priceCurrency), value: 'unitPriceCurrency' },
    { title: intl.formatMessage(messages.exporterName), value: 'exporterName' },
    { title: intl.formatMessage(messages.supplier), value: 'supplierName' },
  ];

  const defaultQueryVariables = {
    perPage: 10,
    page: 1,
    filter: {
      importerId,
      exporterId,
      archived: false,
      query: '',
    },
    sort: { field: 'updatedAt', direction: 'DESCENDING' },
  };

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    defaultQueryVariables,
    cacheKey
  );

  return (
    <Query query={productProvidersListQuery} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'productProviders.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'productProviders.totalPage', data);
        const hasMore = nextPage <= totalPage;

        const items = getByPathWithDefault([], 'productProviders.nodes', data);

        return (
          <ArrayValue>
            {({ value: selected, push, splice, filter }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <FilterToolBar
                    icon="PRODUCT_PROVIDER"
                    sortFields={sortFields}
                    filtersAndSort={filterAndSort}
                    onChange={onChangeFilter}
                    showArchivedTab={false}
                  />
                  <div>
                    <Label>
                      <FormattedMessage
                        id="modules.Orders.orderCurrency"
                        defaultMessage="ORDER CURRENCY"
                      />
                    </Label>
                    <Display align="left">
                      {orderCurrency || (
                        <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
                      )}
                    </Display>
                  </div>
                  <CancelButton onClick={onCancel} />
                  <SaveButton
                    data-testid="btnSaveSelectProductProviders"
                    disabled={selected.length === 0}
                    onClick={() => onSelect(removeTypename(selected))}
                  />
                </SlideViewNavBar>

                <Content>
                  <GridView
                    onLoadMore={() =>
                      loadMore({ fetchMore, data }, queryVariables, 'productProviders')
                    }
                    hasMore={hasMore}
                    isLoading={loading}
                    itemWidth="195px"
                    isEmpty={items.length === 0}
                    emptyMessage={
                      <FormattedMessage
                        id="modules.Orders.noProductProvidersFound"
                        defaultMessage="No end products found"
                      />
                    }
                  >
                    {items.map(item => {
                      const index = selected.map(({ id }) => id).indexOf(item.id);
                      const isSelected = index !== -1;
                      return (
                        <div key={item.id} className={ItemWrapperStyle}>
                          {isSelected && (
                            <IncrementInput
                              value={countSelected(selected, item)}
                              onMinus={() => splice(index, 1)}
                              onPlus={() => push(item)}
                            />
                          )}
                          <OrderProductProviderCard
                            orderCurrency={orderCurrency}
                            productProvider={item}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(({ id }) => id !== item.id);
                              } else {
                                push(item);
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </GridView>
                </Content>
              </SlideViewLayout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

SelectProductProviders.defaultProps = defaultProps;

export default injectIntl(SelectProductProviders);
