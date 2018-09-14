// @flow
import * as React from 'react';
import { getTransportIcon } from './components/Timeline/helpers';
import {
  VerticalLayout,
  TimelineInfoSection,
  VoyageInfoSection,
  VoyageSelector,
} from './components';
import { TimelineSectionWrapperStyle, TimelineWrapperStyle, BodyWrapperStyle } from './style';

const dummyData = {
  transportType: 'Air',
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
    // {
    //   id: '3',
    //   departurePort: 'China',
    //   arrivalPort: null,
    //   departure: {
    //     approvedAt: true,
    //     date: '2018-11-01',
    //     timelineDateRevisions: [],
    //   },
    //   arrival: {
    //     approvedAt: true,
    //     date: '2018-11-01',
    //     timelineDateRevisions: [],
    //   },
    // },
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
      <VoyageInfoSection
        isNew={isNew}
        icon={getTransportIcon(dummyData.transportType)}
        title={dummyData.voyages.length > 1 ? 'FIRST VOYAGE' : 'VOYAGE'}
      />

      {dummyData.voyages.length > 1 && (
        <>
          <TimelineInfoSection
            isNew={isNew}
            icon="TRANSIT"
            title={
              dummyData.voyages.length > 2 ? 'FIRST TRANSIT PORT ARRIVAL' : 'TRANSIT PORT ARRIVAL'
            }
          />
          <TimelineInfoSection
            isNew={isNew}
            icon="TRANSIT"
            title={
              dummyData.voyages.length > 2
                ? 'FIRST TRANSIT PORT DEPARTURE'
                : 'TRANSIT PORT DEPARTURE'
            }
          />
          <VoyageInfoSection
            isNew={isNew}
            icon={getTransportIcon(dummyData.transportType)}
            title="SECOND VOYAGE"
          />
        </>
      )}

      {dummyData.voyages.length > 2 && (
        <>
          <TimelineInfoSection isNew={isNew} icon="TRANSIT" title="SECOND TRANSIT PORT ARRIVAL" />
          <TimelineInfoSection isNew={isNew} icon="TRANSIT" title="SECOND TRANSIT PORT DEPARTURE" />
          <VoyageInfoSection
            isNew={isNew}
            icon={getTransportIcon(dummyData.transportType)}
            title="THIRD VOYAGE"
          />
        </>
      )}

      <TimelineInfoSection isNew={isNew} icon="PORT" title="DISCHARGE PORT ARRIVAL" />
      <TimelineInfoSection isNew={isNew} icon="CUSTOMS" title="CUSTOMS CLEARANCE" />
      <TimelineInfoSection isNew={isNew} icon="WAREHOUSE" title="WAREHOUSE ARRIVAL" />
      <TimelineInfoSection isNew={isNew} icon="DELIVERY_READY" title="DELIVERY READY" />
    </div>
  </div>
);

export default TimelineSection;
