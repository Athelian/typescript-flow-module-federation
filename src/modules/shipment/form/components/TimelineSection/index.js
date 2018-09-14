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
      departurePort: 'ADALV',
      arrivalPort: 'HNGAC',
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
      departurePort: 'HNGAC',
      arrivalPort: null,
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
    //   departurePort: null,
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
    <div className={BodyWrapperStyle} id="timelineInfoSection">
      <TimelineInfoSection id="cargoReady" isNew={isNew} icon="CARGO_READY" title="CARGO READY" />
      <TimelineInfoSection
        id="loadPortDeparture"
        isNew={isNew}
        icon="PORT"
        title="LOAD PORT DEPARTURE"
      />
      <VoyageInfoSection
        id="firstVoyage"
        isNew={isNew}
        icon={getTransportIcon(dummyData.transportType)}
        title={dummyData.voyages.length > 1 ? 'FIRST VOYAGE' : 'VOYAGE'}
      />

      {dummyData.voyages.length > 1 && (
        <>
          <TimelineInfoSection
            id="firstTransitPortArrival"
            isNew={isNew}
            icon="TRANSIT"
            title={
              dummyData.voyages.length > 2 ? 'FIRST TRANSIT PORT ARRIVAL' : 'TRANSIT PORT ARRIVAL'
            }
          />
          <TimelineInfoSection
            id="firstTransitPortDeparture"
            isNew={isNew}
            icon="TRANSIT"
            title={
              dummyData.voyages.length > 2
                ? 'FIRST TRANSIT PORT DEPARTURE'
                : 'TRANSIT PORT DEPARTURE'
            }
          />
          <VoyageInfoSection
            id="secondVoyage"
            isNew={isNew}
            icon={getTransportIcon(dummyData.transportType)}
            title="SECOND VOYAGE"
          />
        </>
      )}

      {dummyData.voyages.length > 2 && (
        <>
          <TimelineInfoSection
            id="secondTransitPortArrival"
            isNew={isNew}
            icon="TRANSIT"
            title="SECOND TRANSIT PORT ARRIVAL"
          />
          <TimelineInfoSection
            id="secondTransitPortDeparture"
            isNew={isNew}
            icon="TRANSIT"
            title="SECOND TRANSIT PORT DEPARTURE"
          />
          <VoyageInfoSection
            id="thirdVoyage"
            isNew={isNew}
            icon={getTransportIcon(dummyData.transportType)}
            title="THIRD VOYAGE"
          />
        </>
      )}

      <TimelineInfoSection
        id="dischargePortArrival"
        isNew={isNew}
        icon="PORT"
        title="DISCHARGE PORT ARRIVAL"
      />
      <TimelineInfoSection
        id="customClearance"
        isNew={isNew}
        icon="CUSTOMS"
        title="CUSTOMS CLEARANCE"
      />
      <TimelineInfoSection
        id="warehouseArrival"
        isNew={isNew}
        icon="WAREHOUSE"
        title="WAREHOUSE ARRIVAL"
      />
      <TimelineInfoSection
        id="deliveryReady"
        isNew={isNew}
        icon="DELIVERY_READY"
        title="DELIVERY READY"
      />
    </div>
  </div>
);

export default TimelineSection;
