// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import loadMore from 'utils/loadMore';
import OrderItemsList from 'providers/OrderItemsList';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import OrderGridView from 'modules/order/list/OrderGridView';
import { ItemCard } from 'components/Cards';
import usePermission from 'hooks/usePermission';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import usePartnerPermission from 'hooks/usePartnerPermission';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const hasMorePage = (result: Object): boolean => {
  const nextPage = getByPathWithDefault(1, 'orderItems.page', result) + 1;
  const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', result);
  return nextPage <= totalPage;
};

const SelectOrderItem = ({ selected, onCancel, onSelect }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  return (
    <ObjectValue
      defaultValue={{
        perPage: 20,
        page: 1,
      }}
    >
      {({ value: filtersAndSort }) => (
        <OrderItemsList {...filtersAndSort}>
          {({ loading, data, fetchMore }) => (
            <ObjectValue defaultValue={selected}>
              {({ value, set }) => (
                <Layout
                  navBar={
                    <SlideViewNavBar>
                      <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
                      <CancelButton onClick={onCancel} />
                      <SaveButton
                        data-testid="saveButtonOnSelectOrderItem"
                        disabled={isEquals(value, selected)}
                        onClick={() => onSelect({ ...removeTypename(value) })}
                      />
                    </SlideViewNavBar>
                  }
                >
                  <OrderGridView
                    hasMore={hasMorePage(data)}
                    isLoading={loading}
                    onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
                    items={getByPathWithDefault([], 'orderItems.nodes', data)}
                    renderItem={item => {
                      const {
                        id,
                        no,
                        quantity,
                        todo,
                        price,
                        tags,
                        totalBatched,
                        totalShipped,
                        batchCount,
                        batchShippedCount,
                        productProvider,
                        order,
                      } = item;
                      const compiledOrderItem = {
                        id,
                        no,
                        todo,
                        quantity,
                        price,
                        tags,
                        totalBatched,
                        totalShipped,
                        batchCount,
                        batchShippedCount,
                      };

                      const { name: productProviderName, product } = productProvider;
                      const compiledProductProvider = { name: productProviderName };

                      const { id: productId, name, serial, tags: productTags, files } = product;
                      const compiledProduct = {
                        id: productId,
                        name,
                        serial,
                        tags: productTags,
                        files,
                      };

                      const { id: orderId, poNo } = order;
                      const compiledOrder = {
                        id: orderId,
                        poNo,
                      };

                      const viewable = {
                        price: hasPermission(ORDER_ITEMS_GET_PRICE),
                      };

                      const config = {
                        hideOrder: false,
                      };

                      return (
                        <ItemCard
                          orderItem={compiledOrderItem}
                          productProvider={compiledProductProvider}
                          product={compiledProduct}
                          order={compiledOrder}
                          viewable={viewable}
                          config={config}
                          selectable
                          selected={value && item.id === value.id}
                          onSelect={() => set(item)}
                          key={compiledOrderItem.id}
                        />
                      );
                    }}
                  />
                </Layout>
              )}
            </ObjectValue>
          )}
        </OrderItemsList>
      )}
    </ObjectValue>
  );
};

SelectOrderItem.defaultProps = defaultProps;

export default SelectOrderItem;
