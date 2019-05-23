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
import usePermission from 'hooks/usePermission';
import { spreadOrderItem } from 'utils/item';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = ({ hasPermission, ...item }: Object) => {
  const { orderItem, productProvider, product, order } = spreadOrderItem(item);

  const viewable = {
    price: hasPermission(ORDER_ITEMS_GET_PRICE),
  };

  const config = {
    hideOrder: false,
  };

  const navigable = {
    order: hasPermission(ORDER_FORM),
    product: hasPermission(PRODUCT_FORM),
  };

  return (
    <ItemCard
      key={orderItem.id}
      onClick={() =>
        hasPermission(ORDER_ITEMS_FORM) ? navigate(`/order-item/${encodeId(item.id)}`) : () => {}
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
};

const OrderItemGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props): React.Node => {
  const { hasPermission } = usePermission();

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
      {items.map(item =>
        renderItem({
          ...item,
          hasPermission,
        })
      )}
    </GridView>
  );
};

export default OrderItemGridView;
