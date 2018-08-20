// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Shipment } from 'modules/shipment/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { ShipmentCardWrapperStyle } from './style';

type Props = {
  shipment: ?Shipment,
};

const ShipmentCard = ({ shipment }: Props) => {
  if (!shipment) return '';

  const { id } = shipment;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="SHIPMENT" color="SHIPMENT" actions={actions}>
      <div
        className={ShipmentCardWrapperStyle}
        onClick={() => navigate(`/shipment/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default ShipmentCard;
