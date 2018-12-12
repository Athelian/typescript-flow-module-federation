// @flow
import React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { ShipmentCardWrapperStyle, ShipmentBlankContent } from '../style';
import ShipmentLabel from '../ShipmentLabel';

type Props = {
  shipment: Object,
};

const ShipmentCollapsed = ({ shipment }: Props) => (
  <div className={ShipmentCardWrapperStyle}>
    <ShipmentLabel
      name={shipment.no}
      value={getByPathWithDefault(0, 'totalVolume.value', shipment)}
      metric={getByPathWithDefault('m³', 'totalVolume.metric', shipment)}
    />
    <div className={ShipmentBlankContent} />
  </div>
);

export default ShipmentCollapsed;
