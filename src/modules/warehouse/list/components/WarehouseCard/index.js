// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import EntityCard, { EntityAction } from 'components/EntityCard';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import { WarehouseCardWrapperStyle } from './style';

type Props = {
  warehouse: ?Warehouse,
};

const WarehouseCard = ({ warehouse }: Props) => {
  if (!warehouse) return '';

  const { id } = warehouse;

  const actions = [
    <EntityAction icon="CLONE" onClick={() => logger.warn('clone')} />,
    <EntityAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
    <EntityAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
  ];

  return (
    <EntityCard icon="WAREHOUSE" color="WAREHOUSE" actions={actions}>
      <div
        className={WarehouseCardWrapperStyle}
        onClick={() => navigate(`/warehouse/${encodeId(id)}`)}
        role="presentation"
      >
        {id}
      </div>
    </EntityCard>
  );
};

export default WarehouseCard;
