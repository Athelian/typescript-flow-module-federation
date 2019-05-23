// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';

import { encodeId } from 'utils/id';
import { spreadOrderItem } from 'utils/item';

import GridView from 'components/GridView';
import { ItemCard } from 'components/Cards';

import usePermission from 'hooks/usePermission';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_GET_PRICE, ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import { PRODUCT_FORM } from 'modules/permission/constants/product';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const ItemGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
  const { hasPermission } = usePermission();

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
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      padding="30px 0"
      emptyMessage={
        <FormattedMessage
          id="modules.OrderItems.noOrderItemsFound"
          defaultMessage="No orderItems found"
        />
      }
    >
      {items.map(item => {
        const { orderItem, productProvider, product, order } = spreadOrderItem(item);
        return (
          <ItemCard
            key={item.id}
            onClick={() =>
              hasPermission(ORDER_ITEMS_FORM)
                ? navigate(`/order-item/${encodeId(item.id)}`)
                : () => {}
            }
            orderItem={orderItem}
            productProvider={productProvider}
            product={product}
            order={order}
            viewable={viewable}
            config={config}
            navigable={navigable}
          />
        );
      })}
    </GridView>
  );
};

export default ItemGridView;
