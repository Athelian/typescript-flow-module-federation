// @flow
import * as React from 'react';
import VerticalTimeline from './VerticalTimeline';
import VerticalDates from './VerticalDates';
import { VerticalLayoutWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const VerticalLayout = ({ shipment }: Props) => (
  <div className={VerticalLayoutWrapperStyle}>
    <VerticalTimeline shipment={shipment} />
    <VerticalDates shipment={shipment} />
  </div>
);

export default VerticalLayout;
