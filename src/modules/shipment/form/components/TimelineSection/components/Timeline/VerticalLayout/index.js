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
      id: '1',
      departurePort: 'Tokyo',
      arrivalPort: 'Hong Kong',
      departure: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
      arrival: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
    },
    {
      id: '2',
      departurePort: 'Hong Kong',
      arrivalPort: 'China',
      departure: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
      arrival: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
    },
    {
      id: '3',
      departurePort: 'China',
      arrivalPort: null,
      departure: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
      arrival: {
        approvedAt: true,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
    },
  ],
  containerGroups: [
    {
      customClearance: {
        approvedAt: false,
        date: '2018-11-01',
        timelineDateRevisions: [],
      },
      warehouseArrival: {
        approvedAt: false,
        date: null,
        timelineDateRevisions: [],
      },
      deliveryReady: {
        approvedAt: false,
        date: '2018-11-01',
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
