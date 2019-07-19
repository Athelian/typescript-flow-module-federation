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
import { Content, SlideViewLayout } from 'components/Layout';
import { ItemCard } from 'components/Cards';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import messages from 'modules/order/messages';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import orderItemsQuery from 'providers/OrderItemsList/query';
import useFilter from 'hooks/useFilter';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { ItemWrapperStyle } from './style';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  filter: Object,
  intl: IntlShape,
};

function initFilterBy(filter: Object) {
  return {
    perPage: 20,
    page: 1,
    filter: {
      query: '',
      archived: false,
      ...filter,
    },
    sort: { field: 'updatedAt', direction: 'DESCENDING' },
  };
}

function SelectOrderItems({ intl, cacheKey, onCancel, onSelect, filter }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const fields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter: onChange } = useFilter(
    initFilterBy(filter),
    cacheKey
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
      {({ value: selected, push, splice, filter: arrayValueFilter }) => (
        <SlideViewLayout>
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

          <Content>
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

                const index = selected.map(({ id }) => id).indexOf(item.id);
                const isSelected = index !== -1;

                return (
                  <div key={item.id} className={ItemWrapperStyle}>
                    {isSelected && (
                      <IncrementInput
                        value={selected.filter(selectedItem => selectedItem.id === item.id).length}
                        onMinus={() => splice(index, 1)}
                        onPlus={() => push(item)}
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
                      selected={isSelected}
                      onSelect={() => {
                        if (isSelected) {
                          arrayValueFilter(({ id }) => id !== item.id);
                        } else {
                          push(item);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </GridView>
            {isLoading && orderItems.length > 0 && <LoadingIcon />}
          </Content>
        </SlideViewLayout>
      )}
    </ArrayValue>
  );
}

const defaultProps = {
  cacheKey: 'SelectOrderItems',
};

SelectOrderItems.defaultProps = defaultProps;

export default injectIntl(SelectOrderItems);
