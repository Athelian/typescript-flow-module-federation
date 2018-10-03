// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import logger from 'utils/logger';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import { WarehouseCardWrapperStyle } from './style';

type OptionalProps = {
  onClick: Function,
  selectable: boolean,
  readOnly: boolean,
};

type Props = OptionalProps & {
  warehouse: ?Warehouse,
};

const defaultProps = {
  onClick: ({ id }) => navigate(`/warehouse/${encodeId(id)}`),
  selectable: false,
  readOnly: false,
};

const WarehouseCard = ({ warehouse, onClick, selectable, readOnly, ...rest }: Props) => {
  if (!warehouse) return '';

  const { id } = warehouse;

  const actions = selectable
    ? []
    : [
        <CardAction icon="CLONE" onClick={() => logger.warn('clone')} />,
        <CardAction icon="ARCHIVE" onClick={() => logger.warn('complete')} />,
        <CardAction icon="REMOVE" hoverColor="RED" onClick={() => logger.warn('delete')} />,
      ];

  return (
    <BaseCard
      {...rest}
      icon="WAREHOUSE"
      color="WAREHOUSE"
      actions={actions}
      selectable={selectable}
      readOnly={readOnly}
    >
      <div
        className={WarehouseCardWrapperStyle}
        onClick={() => onClick(warehouse)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

WarehouseCard.defaultProps = defaultProps;

export default WarehouseCard;
