// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Order } from 'modules/order/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { OrderItemStyle } from './style';

type Props = {
  order: ?Order,
};

const OrderItem = ({ order }: Props) => {
  if (!order) return '';

  const { id } = order;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="ORDER" color="ORDER" actions={actions}>
      <div
        className={OrderItemStyle}
        onClick={() => navigate(`/order/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default OrderItem;
