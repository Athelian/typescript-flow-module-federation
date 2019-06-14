// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import { removeTypename } from 'utils/data';
import GridView from 'components/GridView';
import FilterToolBar from 'components/common/FilterToolBar';
import IncrementInput from 'components/IncrementInput';
import Layout from 'components/Layout';
import { Label, Display } from 'components/Form';
import { OrderProductProviderCard } from 'components/Cards';
import { SlideViewNavBar } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import type { OrderItem } from 'modules/order/type.js.flow';
import useSortAndFilter from 'hooks/useSortAndFilter';
import { productProvidersListQuery } from 'modules/productProvider/list/query';
import { ItemWrapperStyle } from './style';

type OptionalProps = {
  importerId: string,
  exporterId: string,
  orderCurrency: string,
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
};

function onSelectProduct({
  selected,
  item,
  push,
  set,
}: {
  selected: Array<OrderItem>,
  item: OrderItem,
  push: Function,
  set: Function,
}) {
  if (!selected.includes(item)) {
    push(item);
  } else {
    set(selected.filter((orderItem: OrderItem) => orderItem.id !== item.id));
  }
}

const getProductQuantity = (items: Array<OrderItem> = [], item: OrderItem) =>
  items.filter(endProduct => endProduct.id === item.id).length;

function onChangeProductQuantity({
  selected,
  set,
  item,
  total,
}: {
  selected: Array<OrderItem>,
  item: OrderItem,
  set: Function,
  total: number,
}) {
  const items = [...selected];
  const count = getProductQuantity(items, item);
  const index = items.indexOf(item);
  items.splice(index, count, ...Array(total).fill(item));

  set(items);
}

function SelectProducts({
  intl,
  onCancel,
  onSelect,
  importerId,
  exporterId,
  orderCurrency,
}: Props) {
  const sortFields = [
    { title: intl.formatMessage(messages.nameSort), value: 'name' },
    { title: intl.formatMessage(messages.serialSort), value: 'serial' },
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    { title: intl.formatMessage(messages.priceCurrency), value: 'unitPriceCurrency' },
  ];

  const {
    filterAndSort: filtersAndSort,
    queryVariables,
    onChangeFilter: onChange,
  } = useSortAndFilter({
    perPage: 20,
    page: 1,
    filter: {
      importerId,
      exporterId,
      archived: false,
      query: '',
    },
    sort: { field: 'updatedAt', direction: 'DESCENDING' },
  });
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
            {({ value: selected, push, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="PRODUCT_PROVIDER"
                      sortFields={sortFields}
                      filtersAndSort={filtersAndSort}
                      onChange={onChange}
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
                      disabled={selected.length === 0}
                      onClick={() => onSelect(removeTypename(selected))}
                    />
                  </SlideViewNavBar>
                }
              >
                <GridView
                  onLoadMore={() =>
                    loadMore({ fetchMore, data }, filtersAndSort, 'productProviders')
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
                  {items.map(item => (
                    <div key={item.id} className={ItemWrapperStyle}>
                      {selected.includes(item) && (
                        <IncrementInput
                          value={getProductQuantity(selected, item)}
                          onChange={total =>
                            onChangeProductQuantity({ selected, set, total, item })
                          }
                        />
                      )}
                      <OrderProductProviderCard
                        orderCurrency={orderCurrency}
                        productProvider={item}
                        selectable
                        selected={selected.includes(item)}
                        onSelect={() => onSelectProduct({ selected, item, push, set })}
                      />
                    </div>
                  ))}
                </GridView>
              </Layout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

SelectProducts.defaultProps = defaultProps;

export default injectIntl(SelectProducts);
