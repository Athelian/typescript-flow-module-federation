// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { injectIntl, FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import type { IntlShape } from 'react-intl';
import { ArrayValue } from 'react-values';
import { spreadOrderItem } from 'utils/item';
import { trackingError } from 'utils/trackingError';
import { getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import LoadingIcon from 'components/LoadingIcon';
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
  const orderItems = [];
  for (let counter = 0; counter < total; counter += 1) {
    orderItems.push(item);
  }
  set(orderItems.concat(selected.filter((orderItem: OrderItem) => orderItem.id !== item.id)));
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
      perPage: 20,
      page: 1,
      filter: {
        query: '',
        archived: false,
      },
      sort: { field: 'updatedAt', direction: 'DESCENDING' },
    },
    'filterSelectOrderItems'
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [orderItems, setOrderItems] = React.useState([]);
  const { loading, error, client, networkStatus } = useQuery(orderItemsQuery, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: result => {
      setOrderItems(getByPathWithDefault([], 'orderItems.nodes', result));
      const nextPage = getByPathWithDefault(1, 'orderItems.page', result) + 1;
      const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', result);
      setHasMore(nextPage <= totalPage);
      setPage(nextPage);
      setIsLoading(false);
    },
  });

  const refetching = networkStatus === 4;

  React.useEffect(() => {
    if (loading && !refetching) {
      setIsLoading(true);
    }
  }, [loading, refetching]);

  if (error) {
    return error.message;
  }

  return (
    <ArrayValue>
      {({ value: selected, push, set }) => (
        <Layout
          navBar={
            <SlideViewNavBar>
              <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
              <SortInput
                sort={fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]}
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
            onLoadMore={() => {
              setIsLoading(true);
              client
                .query({
                  query: orderItemsQuery,
                  fetchPolicy: 'no-cache',
                  variables: {
                    ...queryVariables,
                    page,
                  },
                })
                .then(result => {
                  setOrderItems([
                    ...orderItems,
                    ...getByPathWithDefault([], 'data.orderItems.nodes', result),
                  ]);
                  const nextPage = getByPathWithDefault(1, 'data.orderItems.page', result) + 1;
                  const totalPage = getByPathWithDefault(1, 'data.orderItems.totalPage', result);
                  setHasMore(nextPage <= totalPage);
                  setPage(nextPage);
                  setIsLoading(false);
                })
                .catch(err => {
                  trackingError(err);
                  toast.error(
                    intl.formatMessage({
                      id: 'global.apiErrorMessage',
                      defaultMessage: 'There was an error. Please try again later.',
                    })
                  );
                  setIsLoading(false);
                });
            }}
            loader={null}
            hasMore={hasMore}
            isLoading={isLoading && orderItems.length === 0}
            itemWidth="195px"
            isEmpty={orderItems.length === 0}
            emptyMessage={
              <FormattedMessage
                id="modules.Batches.noOrderItemsFound"
                defaultMessage="No orderItems found"
              />
            }
          >
            {orderItems.map(item => {
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
                      value={selected.filter(selectedItem => selectedItem.id === item.id).length}
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
          {isLoading && orderItems.length > 0 && <LoadingIcon />}
        </Layout>
      )}
    </ArrayValue>
  );
}

export default injectIntl(SelectOrderItems);
