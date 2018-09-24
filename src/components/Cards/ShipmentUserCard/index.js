// @flow
import React from 'react';
import { type User as ShipmentUser } from 'modules/staff/type.js.flow';
import BaseCard from '../BaseCard';
import { ShipmentUserCardWrapperStyle } from './style';

type OptionalProps = {
  onClick: Function,
};

type Props = OptionalProps & {
  staff: ?ShipmentUser,
};

const defaultProps = {
  onClick: () => {},
};

const ShipmentUserCard = ({ staff, onClick, ...rest }: Props) => {
  if (!staff) return '';

  const { id } = staff;

  return (
    <BaseCard {...rest} icon="STAFF" color="STAFF">
      <div className={ShipmentUserCardWrapperStyle} onClick={onClick} role="presentation">
        {id}
      </div>
    </BaseCard>
  );
};

ShipmentUserCard.defaultProps = defaultProps;
export default ShipmentUserCard;
