// @flow
import React from 'react';
import { calculateTotalPackageGrossWeight } from 'modules/relationMap/util';
import { ShipmentCardWrapperStyle, ShipmentBlankContent } from '../style';
import ShipmentLabel from '../ShipmentLabel';

type Props = {
  shipment: Object,
};

const ShipmentCollapsed = ({ shipment }: Props) => {
  const { batches = [] } = shipment;

  const totalPackageGrossWeight = calculateTotalPackageGrossWeight(batches);

  return (
    <div className={ShipmentCardWrapperStyle}>
      <ShipmentLabel name={shipment.no} vol={totalPackageGrossWeight} metric="cm³" />
      <div className={ShipmentBlankContent} />
    </div>
  );
};

export default ShipmentCollapsed;
