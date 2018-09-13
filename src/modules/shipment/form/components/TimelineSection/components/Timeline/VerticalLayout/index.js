// @flow
import * as React from 'react';
import VerticalTimeline from './VerticalTimeline';
import VerticalDates from './VerticalDates';
import { VerticalLayoutWrapperStyle } from './style';

const dummyData = {
  cargoReady: {
    approvedAt: false,
    date: '2018-11-01',
    timelineDateRevisions: [
      {
        date: '2018-01-02',
      },
      {
        date: '2018-11-12',
      },
    ],
  },
  voyages: [
    {
      departurePort: 'Hello',
      arrivalPort: null,
      departure: {
        approvedAt: true,
        date: null,
        timelineDateRevisions: [],
      },
      arrival: {
        approvedAt: true,
        date: null,
        timelineDateRevisions: [],
      },
    },
  ],
  containerGroups: [
    {
      customClearance: {
        approvedAt: false,
        date: null,
        timelineDateRevisions: [],
      },
      warehouseArrival: {
        approvedAt: false,
        date: null,
        timelineDateRevisions: [],
      },
      deliveryReady: {
        approvedAt: false,
        date: null,
        timelineDateRevisions: [],
      },
    },
  ],
};

const VerticalLayout = () => (
  <div className={VerticalLayoutWrapperStyle}>
    <VerticalTimeline shipment={dummyData} />
    <VerticalDates shipment={dummyData} />
  </div>
);

export default VerticalLayout;
