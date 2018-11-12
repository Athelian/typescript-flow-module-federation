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
    ? batches.reduce((accumulator, { packageVolume, packageQuantity = 0 }) => {
        const { metric, value } = packageVolume || {};
        const addingValue = (packageVolume && value) || 0;

        switch (metric) {
          case 'cm³':
            return accumulator + packageQuantity * addingValue;
          case 'm³':
            return accumulator + packageQuantity * addingValue * 1000;
          default:
            return accumulator;
        }
      }, 0)
    : 0;

  return (
    <div className={ShipmentCardWrapperStyle}>
      <ShipmentLabel name={shipment.no} vol={totalPackageGrossWeight} metric="cm³" />
      <div className={ShipmentBlankContent} />
    </div>
  );
};

export default ShipmentCollapsed;
