// @flow
import * as React from 'react';
import { VerticalLayout, TimelineInfoSection, VoyageSelector } from './components';
import { TimelineSectionWrapperStyle, TimelineWrapperStyle, BodyWrapperStyle } from './style';

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
        date: null,
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

type Props = {
  isNew: boolean,
};

const TimelineSection = ({ isNew }: Props) => (
  <div className={TimelineSectionWrapperStyle}>
    <div className={TimelineWrapperStyle}>
      <VerticalLayout shipment={dummyData} />
      <VoyageSelector shipment={dummyData} />
    </div>
    <div className={BodyWrapperStyle}>
      <TimelineInfoSection isNew={isNew} icon="CARGO_READY" title="CARGO READY" />
      <TimelineInfoSection isNew={isNew} icon="PORT" title="LOAD PORT DEPARTURE" />
      <TimelineInfoSection isNew={isNew} icon="PORT" title="DISCHARGE PORT ARRIVAL" />
      <TimelineInfoSection isNew={isNew} icon="CUSTOMS" title="CUSTOMS CLEARANCE" />
      <TimelineInfoSection isNew={isNew} icon="WAREHOUSE" title="WAREHOUSE ARRIVAL" />
      <TimelineInfoSection isNew={isNew} icon="DELIVERY_READY" title="DELIVERY READY" />
    </div>
  </div>
);

export default TimelineSection;
