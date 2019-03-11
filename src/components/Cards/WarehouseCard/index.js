// @flow
import React from 'react';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard, { CardAction } from '../BaseCard';
import {
  WarehouseCardWrapperStyle,
  WarehouseCardImageStyle,
  WarehouseInfoWrapperStyle,
  WarehouseNameStyle,
  OwnedByWrapperStyle,
  OwnedByIconStyle,
  OwnedByStyle,
} from './style';

type OptionalProps = {
  onClick: Function,
  selectable: boolean,
  readOnly: boolean,
  onClone: Function,
};

type Props = OptionalProps & {
  warehouse: {
    id: string,
    name: string,
    ownedBy: {
      name: string,
    },
  },
};

const defaultProps = {
  onClick: () => {},
  selectable: false,
  readOnly: false,
  onClone: () => {},
};

const WarehouseCard = ({ warehouse, onClick, selectable, readOnly, onClone, ...rest }: Props) => {
  const { name, ownedBy } = warehouse;

  const actions = selectable || readOnly ? [] : [<CardAction icon="CLONE" onClick={onClone} />];

  return (
    <BaseCard
      {...rest}
      icon="WAREHOUSE"
      color="WAREHOUSE"
      actions={actions}
      selectable={selectable}
      readOnly={readOnly}
    >
      <div role="presentation" className={WarehouseCardWrapperStyle} onClick={onClick}>
        <img className={WarehouseCardImageStyle} src={FALLBACK_IMAGE} alt="warehouse_image" />
        <div className={WarehouseInfoWrapperStyle}>
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

WarehouseCard.defaultProps = defaultProps;

export default withForbiddenCard(WarehouseCard, 'warehouse', {
  width: '195px',
  height: '215px',
  entityIcon: 'WAREHOUSE',
  entityColor: 'WAREHOUSE',
});
