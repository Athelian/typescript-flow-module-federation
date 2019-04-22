// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { ItemCard } from 'components/Cards';
import GridView from 'components/GridView';
import usePermission from 'hooks/usePermission';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => {
  const {
    id,
    no,
    quantity,
    price,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
    productProvider,
    order,
    viewable,
  } = item;
  const compiledOrderItem = {
    id,
    no,
    quantity,
    price,
    totalBatched,
    totalShipped,
    batchCount,
    batchShippedCount,
  };

  const { exporter, supplier, unitPrice, product } = productProvider;
  const compiledProductProvider = {
    exporter,
    supplier,
    unitPrice,
  };

  const { id: productId, name, serial, tags, files } = product;
  const compiledProduct = {
    id: productId,
    name,
    serial,
    tags,
    files,
  };

  const { currency, poNo } = order;
  const compiledOrder = {
    currency,
    poNo,
  };

  return (
    <ItemCard
      onClick={() => navigate(`/order-item/${encodeId(item.id)}`)}
      viewable={viewable}
      orderItem={compiledOrderItem}
      productProvider={compiledProductProvider}
      product={compiledProduct}
      order={compiledOrder}
      actions={[]}
      config={{
        hideOrder: false,
      }}
      key={item.id}
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
          viewable: {
            price: hasPermission(ORDER_ITEMS_GET_PRICE),
          },
        })
      )}
    </GridView>
  );
};

export default OrderItemGridView;
