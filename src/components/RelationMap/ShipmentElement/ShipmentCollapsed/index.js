// @flow
import React from 'react';
import { ShipmentCardWrapperStyle, ShipmentBlankContent } from '../style';
import ShipmentLabel from '../ShipmentLabel';

type Props = {
  shipment: Object,
};

const ShipmentCollapsed = ({ shipment }: Props) => (
  <div className={ShipmentCardWrapperStyle}>
    <ShipmentLabel name={shipment.no} vol="" />
    <div className={ShipmentBlankContent} />
  </div>
);

export default ShipmentCollapsed;
