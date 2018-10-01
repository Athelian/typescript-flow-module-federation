// @flow

import React from 'react';
import ShipmentHeader from './ShipmentLabel';
import ShipmentTimeline from './ShipmentTimeline/TimelineLayout';
import { ShipmentElementWrapperStyle } from './style';

type Props = {
  shipment: Object,
};

const ShipmentElement = ({ shipment }: Props) => (
  <>
    <div className={ShipmentElementWrapperStyle}>
      <ShipmentHeader name={shipment.no} vol="100m3" />
      <ShipmentTimeline shipment={shipment} />
    </div>
  </>
);
export default ShipmentElement;
