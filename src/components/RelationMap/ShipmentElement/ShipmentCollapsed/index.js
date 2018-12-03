// @flow
import React from 'react';
import { calculateVolumeWeight } from 'modules/relationMap/util';
import { ShipmentCardWrapperStyle, ShipmentBlankContent } from '../style';
import ShipmentLabel from '../ShipmentLabel';

type Props = {
  shipment: Object,
};

const ShipmentCollapsed = ({ shipment }: Props) => {
  const { batches = [] } = shipment;
  const totalPackageGrossWeight = batches.reduce((total, batch) => {
    const sumTotal = total + calculateVolumeWeight(batch);
    return sumTotal;
  }, 0);
  return (
    <div className={ShipmentCardWrapperStyle}>
      <ShipmentLabel name={shipment.no} value={totalPackageGrossWeight} metric={shipment.metric} />
      <div className={ShipmentBlankContent} />
    </div>
  );
};

export default ShipmentCollapsed;
