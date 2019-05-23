// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';

import { spreadOrderItem } from 'utils/item';
import { getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import loadMore from 'utils/loadMore';

import GridView from 'components/GridView';
import IncrementInput from 'components/IncrementInput';
import Layout from 'components/Layout';
import { ItemCard } from 'components/Cards';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

import messages from 'modules/order/messages';
import type { OrderItem } from 'modules/order/type.js.flow';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';

import orderItemsQuery from 'providers/OrderItemsList/query';
import useFilter from 'hooks/useFilter';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';

import { ItemWrapperStyle } from './style';

type Props = {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
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

function onChangeProductQuantity({
  selected,
  item,
  set,
  total,
}: {
  selected: Array<OrderItem>,
  item: OrderItem,
  set: Function,
  total: number,
}) {
  const items = [];
  for (let counter = 0; counter < total; counter += 1) {
    items.push(item);
  }
  set(items.concat(selected.filter((orderItem: OrderItem) => orderItem.id !== item.id)));
}

function SelectOrderItems({ intl, onCancel, onSelect }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const fields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter: onChange } = useFilter(
    {
      perPage: 10,
      page: 1,
      filter: {
        query: '',
        archived: false,
      },
      sort: { field: 'updatedAt', direction: 'DESCENDING' },
    },
    'filterSelectOrderItems'
  );
  return (
    <Query query={orderItemsQuery} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'orderItems.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', data);
        const hasMore = nextPage <= totalPage;
        const items = getByPathWithDefault([], 'orderItems.nodes', data);
        return (
          <ArrayValue>
            {({ value: selected, push, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
                    <SortInput
                      sort={
                        fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]
                      }
                      ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
                      fields={fields}
                      onChange={({ field: { value }, ascending }) =>
                        onChange({
                          ...filtersAndSort,
                          sort: {
                            field: value,
                            direction: ascending ? 'ASCENDING' : 'DESCENDING',
                          },
                        })
                      }
                    />
                    <SearchInput
                      value={filtersAndSort.filter.query}
                      name="search"
                      onClear={() =>
                        onChange({
                          ...filtersAndSort,
                          filter: { ...filtersAndSort.filter, query: '' },
                        })
                      }
                      onChange={newQuery =>
                        onChange({
                          ...filtersAndSort,
                          filter: { ...filtersAndSort.filter, query: newQuery },
                        })
                      }
                    />
                    <CancelButton onClick={onCancel} />
                    <SaveButton
                      disabled={selected.length === 0}
                      onClick={() => onSelect(removeTypename(selected))}
                    />
                  </SlideViewNavBar>
                }
              >
                <GridView
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
                  hasMore={hasMore}
                  isLoading={loading}
                  itemWidth="195px"
                  isEmpty={items.length === 0}
                  emptyMessage={
                    <FormattedMessage
                      id="modules.Batches.noOrderItemsFound"
                      defaultMessage="No items found"
                    />
                  }
                >
                  {items.map(item => {
                    const { orderItem, productProvider, product, order } = spreadOrderItem(item);

                    const viewable = {
                      price: hasPermission(ORDER_ITEMS_GET_PRICE),
                    };

                    const config = {
                      hideOrder: false,
                    };

                    return (
                      <div key={item.id} className={ItemWrapperStyle}>
                        {selected.includes(item) && (
                          <IncrementInput
                            value={
                              selected.filter(selectedItem => selectedItem.id === item.id).length
                            }
                            onChange={total =>
                              onChangeProductQuantity({
                                total,
                                selected,
                                item,
                                set,
                              })
                            }
                          />
                        )}
                        <ItemCard
                          orderItem={orderItem}
                          productProvider={productProvider}
                          product={product}
                          order={order}
                          viewable={viewable}
                          config={config}
                          selectable
                          selected={selected.includes(item)}
                          onSelect={() => onSelectProduct({ selected, item, push, set })}
                        />
                      </div>
                    );
                  })}
                </GridView>
              </Layout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

export default injectIntl(SelectOrderItems);
