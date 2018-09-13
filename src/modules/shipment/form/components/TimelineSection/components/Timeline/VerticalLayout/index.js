// @flow
import * as React from 'react';
import VerticalTimeline from './VerticalTimeline';
import { TimelineWrapperStyle, TimelineLeftWrapperStyle, TimelineRightWrapperStyle } from './style';

const dummyData = {
  cargoReady: {
    approvedAt: false,
  },
  voyages: [
    {
      departure: {
        approvedAt: true,
      },
      arrival: {
        approvedAt: true,
      },
    },
    {
      departure: {
        approvedAt: true,
      },
      arrival: {
        approvedAt: true,
      },
    },
    {
      departure: {
        approvedAt: true,
      },
      arrival: {
        approvedAt: true,
      },
    },
  ],
  containerGroups: [
    {
      customClearance: {
        approvedAt: false,
      },
      warehouseArrival: {
        approvedAt: false,
      },
      deliveryReady: {
        approvedAt: false,
      },
    },
  ],
};

const VerticalLayout = () => (
  <div className={TimelineWrapperStyle}>
    <div className={TimelineLeftWrapperStyle}>
      <VerticalTimeline shipment={dummyData} />
    </div>
    <div className={TimelineRightWrapperStyle}>Hi</div>
  </div>
);

export default VerticalLayout;
