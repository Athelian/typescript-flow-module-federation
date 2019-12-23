// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { ItemCard } from 'components/Cards';
import { spreadOrderItem } from 'utils/item';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { ORDER_ITEMS_FORM, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { PRODUCT_FORM } from 'modules/permission/constants/product';

type Props = {
  orderItem: Object,
};

const ParentItemCard = ({ orderItem }: Props) => {
  const hasItemPermissions = useEntityHasPermissions(orderItem);
  const hasOrderPermissions = useEntityHasPermissions(orderItem?.order);
  const hasProductPermissions = useEntityHasPermissions(orderItem?.productProvider?.product);

  return (
    <ItemCard
      {...spreadOrderItem(orderItem)}
      onClick={() => {
        if (hasItemPermissions(ORDER_ITEMS_FORM) && !!orderItem?.id) {
          navigate(`/order-item/${encodeId(orderItem?.id)}`);
        }
      }}
      viewable={{
        price: hasItemPermissions(ORDER_ITEMS_GET_PRICE),
      }}
      navigable={{
        order: hasOrderPermissions(ORDER_FORM),
        product: hasProductPermissions(PRODUCT_FORM),
      }}
    />
  );
};

export default ParentItemCard;
