// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE, ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import { ItemCard } from 'components/Cards';
import GridView from 'components/GridView';
import { spreadOrderItem } from 'utils/item';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const DefaultRenderItem = (item: Object) => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => {
      const { orderItem, productProvider, product, order } = spreadOrderItem(item);

      const viewable = {
        price: permissions.includes(ORDER_ITEMS_GET_PRICE),
      };

      const config = {
        hideOrder: false,
      };

      const navigable = {
        order: permissions.includes(ORDER_FORM),
        product: permissions.includes(PRODUCT_FORM),
      };

      return (
        <ItemCard
          key={orderItem.id}
          onClick={() =>
            permissions.includes(ORDER_ITEMS_FORM)
              ? navigate(`/order-item/${encodeId(item.id)}`)
              : () => {}
          }
          orderItem={orderItem}
          productProvider={productProvider}
          product={product}
          order={order}
          actions={[]}
          viewable={viewable}
          config={config}
          navigable={navigable}
        />
      );
    }}
  </PartnerPermissionsWrapper>
);

const OrderItemGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = DefaultRenderItem,
}: Props): React.Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.OrderItems.noOrderItemFound"
          defaultMessage="No order Items found"
        />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

export default OrderItemGridView;
