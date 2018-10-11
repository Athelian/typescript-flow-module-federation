// @flow
import React from 'react';
import { Link, navigate } from '@reach/router';
import { type Warehouse } from 'modules/warehouse/type.js.flow';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import { encodeId } from 'utils/id';
import BaseCard, { CardAction } from '../BaseCard';
import {
  WarehouseCardWrapperStyle,
  WarehouseCardImageStyle,
  WarehouseInfoWrapperStyle,
  WarehouseNameStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
  selectable: boolean,
  readOnly: boolean,
  onClone: Function,
};

type Props = OptionalProps & {
  warehouse: ?Warehouse,
};

const defaultProps = {
  onClick: () => {},
  selectable: false,
  readOnly: false,
  onClone: () => {},
};

function onClone(warehouseId: string) {
  navigate(`/warehouse/clone/${encodeId(warehouseId)}`);
}

const WarehouseCard = ({ warehouse, onClick, selectable, readOnly, ...rest }: Props) => {
  if (!warehouse) return '';

  const { name } = warehouse;

  const actions = selectable
    ? []
    : [<CardAction icon="CLONE" onClick={() => onClone(warehouse.id)} />];

  return (
    <BaseCard
      {...rest}
      icon="WAREHOUSE"
      color="WAREHOUSE"
      actions={actions}
      selectable={selectable}
      readOnly={readOnly}
    >
      <Link
        className={WarehouseCardWrapperStyle}
        to={!selectable ? `/warehouse/${encodeId(warehouse.id)}` : '.'}
        onClick={onClick}
      >
        <img className={WarehouseCardImageStyle} src={FALLBACK_IMAGE} alt="warehouse_image" />
        <div className={WarehouseInfoWrapperStyle}>
          <div className={WarehouseNameStyle}>{name}</div>
        </div>
      </Link>
    </BaseCard>
  );
};

WarehouseCard.defaultProps = defaultProps;

export default WarehouseCard;
