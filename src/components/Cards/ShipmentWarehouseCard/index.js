// @flow
import React from 'react';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import BaseCard from 'components/Cards';
import withForbiddenCard from 'hoc/withForbiddenCard';
import {
  ShipmentWarehouseCardWrapperStyle,
  ShipmentWarehouseCardImageStyle,
  ShipmentWarehouseInfoWrapperStyle,
  WarehouseNameStyle,
  OwnedByWrapperStyle,
  OwnedByIconStyle,
  OwnedByStyle,
} from './style';

type OptionalProps = {
  warehouse: {
    id: string,
    name: string,
    ownedBy: {
      name: string,
    },
    locality: ?string,
    region: ?string,
  },
  onClick: Function,
};

type Props = OptionalProps & {};

const defaultProps = {
  onClick: () => {},
};

const ShipmentWarehouseCard = ({ warehouse, onClick, ...rest }: Props) => {
  const { name, ownedBy } = warehouse;

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
          <div className={OwnedByWrapperStyle}>
            <div className={OwnedByIconStyle}>
              <Icon icon="PARTNER" />
            </div>
            <div className={OwnedByStyle}>{ownedBy && ownedBy.name}</div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

ShipmentWarehouseCard.defaultProps = defaultProps;

export default withForbiddenCard(ShipmentWarehouseCard, 'warehouse', {
  width: '195px',
  height: '40px',
  entityIcon: 'WAREHOUSE',
  entityColor: 'WAREHOUSE',
  forceAbleToClick: true,
});
