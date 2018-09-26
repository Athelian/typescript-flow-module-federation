// @flow

import React from 'react';
import ShipmentHeader from './ShipmentHeader';
import ShipmentTimeline from './ShipmentTimeline/TimelineLayout';
import { ShipmentElementWrapperStyle } from './style';

type Props = {
  shipment: Object,
};

const ShipmentElement = ({ shipment }: Props) => (
  <>
    <div className={ShipmentElementWrapperStyle}>
      <ShipmentHeader name="SHIPMENT_NAME" vol="100m3" />
      <ShipmentTimeline shipment={shipment} />
    </div>
  </>
);
export default ShipmentElement;
