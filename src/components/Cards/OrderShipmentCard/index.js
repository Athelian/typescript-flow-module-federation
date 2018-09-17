// @flow
import React from 'react';
import { navigate } from '@reach/router';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import type { ShipmentListCard } from './type.js.flow';
import BaseCard, { CardAction } from '../BaseCard';
import { ShipmentCardWrapperStyle } from './style';

type Props = {
  shipment: ?ShipmentListCard,
};

const ShipmentCard = ({ shipment }: Props) => {
  if (!shipment) return '';

  const { id } = shipment;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="SHIPMENT" color="SHIPMENT" actions={actions}>
      <div
        className={ShipmentCardWrapperStyle}
        onClick={() => navigate(`/shipment/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default ShipmentCard;
