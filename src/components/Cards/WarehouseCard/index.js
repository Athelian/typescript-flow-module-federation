// @flow
import * as React from 'react';
import type { Warehouse } from 'generated/graphql';
import FALLBACK_IMAGE from 'media/logo_fallback.jpg';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import BaseCard from '../BaseCard';
import {
  WarehouseCardWrapperStyle,
  WarehouseCardImageStyle,
  WarehouseInfoWrapperStyle,
  WarehouseNameStyle,
  OwnedByWrapperStyle,
  OwnedByIconStyle,
  OwnedByStyle,
} from './style';

type Props = {|
  onClick: Function,
  selectable: boolean,
  readOnly: boolean,
  actions: Array<React.Node>,
  warehouse: Warehouse,
|};

const defaultProps = {
  onClick: () => {},
  selectable: false,
  readOnly: false,
  actions: [],
};

const WarehouseCard = ({ warehouse, onClick, selectable, readOnly, actions, ...rest }: Props) => {
  const { name, ownedBy, archived } = warehouse;

  return (
    <BaseCard
      icon="WAREHOUSE"
      color="WAREHOUSE"
      actions={selectable || readOnly ? [] : actions}
      selectable={selectable}
      readOnly={readOnly}
      showBadge={warehouse?.notificationUnseenCount > 0}
      isArchived={archived}
      {...rest}
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
  forceAbleToClick: true,
});
