// @flow
import React from 'react';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import BaseCard from '../BaseCard';
import { ShipmentWarehouseCardWrapperStyle } from './style';

type Props = {
  warehouse: ?Warehouse,
  onClick: Warehouse => void,
};

const ShipmentWarehouseCard = ({ warehouse, onClick, ...rest }: Props) => {
  if (!warehouse) return '';

  const { id } = warehouse;

  const actions = [];

  return (
    <BaseCard icon="WAREHOUSE" color="WAREHOUSE" actions={actions} {...rest}>
      <div
        className={ShipmentWarehouseCardWrapperStyle}
        onClick={() => onClick(warehouse)}
        role="presentation"
      >
        {id}
      </div>
    </BaseCard>
  );
};

export default ShipmentWarehouseCard;
