// @flow
import React from 'react';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import BaseCard from '../BaseCard';
import {
  ShipmentWarehouseCardWrapperStyle,
  ShipmentWarehouseCardImageStyle,
  ShipmentWarehouseInfoWrapperStyle,
  WarehouseNameStyle,
} from './style';

type Props = {
  warehouse: ?Warehouse,
  onClick: Warehouse => void,
};

const ShipmentWarehouseCard = ({ warehouse, onClick, ...rest }: Props) => {
  if (!warehouse) return '';

  const { name } = warehouse;

  const actions = [];

  return (
    <BaseCard icon="WAREHOUSE" color="WAREHOUSE" actions={actions} {...rest}>
      <div
        className={ShipmentWarehouseCardWrapperStyle}
        onClick={() => onClick(warehouse)}
        role="presentation"
      >
        <img
          className={ShipmentWarehouseCardImageStyle}
          src={FALLBACK_IMAGE}
          alt="warehouse_image"
        />
        <div className={ShipmentWarehouseInfoWrapperStyle}>
          <div className={WarehouseNameStyle}>{name}</div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ShipmentWarehouseCard;
