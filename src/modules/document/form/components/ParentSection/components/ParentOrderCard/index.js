// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { OrderCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { ORDER_FORM } from 'modules/permission/constants/order';

type Props = {
  order: Object,
};

const ParentOrderCard = ({ order }: Props) => {
  const hasPermissions = useEntityHasPermissions(order);

  return (
    <OrderCard
      order={order}
      onClick={() => {
        if (hasPermissions(ORDER_FORM) && !!order?.id) {
          navigate(`/order/${encodeId(order?.id)}`);
        }
      }}
    />
  );
};

export default ParentOrderCard;
