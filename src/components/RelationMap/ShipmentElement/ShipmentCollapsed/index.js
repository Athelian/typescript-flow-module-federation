// @flow
import React from 'react';
import { ShipmentCardWrapperStyle, ShipmentBlankContent } from '../style';
import ShipmentLabel from '../ShipmentLabel';

type Props = {
  shipment: Object,
};

const ShipmentCollapsed = ({ shipment }: Props) => {
  const { batches = [] } = shipment;

  const totalPackageGrossWeight = batches
    ? batches.reduce(
        (accumulator, currentValue) => accumulator + currentValue.packageVolume.value,
        0
      )
    : 0;

  return (
    <div className={ShipmentCardWrapperStyle}>
      <ShipmentLabel name={shipment.no} vol={totalPackageGrossWeight.toFixed(2)} />
      <div className={ShipmentBlankContent} />
    </div>
  );
};

export default ShipmentCollapsed;
