// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { WarehouseCardWrapperStyle } from './style';

type Props = {
  warehouse: ?Warehouse,
};

const WarehouseCard = ({ warehouse }: Props) => {
  if (!warehouse) return '';

  const { id } = warehouse;

  const actions = [
    <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <BaseCard icon="WAREHOUSE" color="WAREHOUSE" actions={actions}>
      <div
        className={WarehouseCardWrapperStyle}
        onClick={() => navigate(`/warehouse/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default WarehouseCard;
