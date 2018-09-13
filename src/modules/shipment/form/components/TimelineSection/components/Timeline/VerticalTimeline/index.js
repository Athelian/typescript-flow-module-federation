// @flow
import * as React from 'react';
import { TimelineIcon, TimelineLine, TimelineVoyage } from '../components';
import { getTimelineColoring } from '../helpers';
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

const VerticalTimeline = () => {
  const { cargoReady, voyages, containerGroups } = dummyData;

  const coloring = getTimelineColoring({ cargoReady, voyages, containerGroups });

  const cargoReadyColoring = coloring[0];
  const loadPortDepartureColoring = coloring[1];
  const dischargePortArrivalColoring = coloring[coloring.length - 4];
  const customClearanceColoring = coloring[coloring.length - 3];
  const warehouseArrivalColoring = coloring[coloring.length - 2];
  const deliveryReadyColoring = coloring[coloring.length - 1];

  return (
    <div className={TimelineWrapperStyle}>
      <div className={TimelineLeftWrapperStyle}>
        <TimelineIcon icon="CARGO_READY" color={cargoReadyColoring} />

        <TimelineLine color={loadPortDepartureColoring} />

        <TimelineIcon icon="PORT" color={loadPortDepartureColoring} />

        <TimelineVoyage>
          <TimelineLine color={loadPortDepartureColoring} />
          <TimelineLine color={coloring[2]} />
          <TimelineIcon icon="PLANE" color={loadPortDepartureColoring} />
        </TimelineVoyage>

        {voyages.length > 1 &&
          voyages.slice(1).map((voyage, index) => (
            <>
              <TimelineIcon icon="TRANSIT" color={coloring[index + 2]} />

              <TimelineVoyage>
                <TimelineLine color={coloring[index + 3]} />
                <TimelineLine color={coloring[index + 4]} />
                <TimelineIcon icon="PLANE" color={coloring[index + 3]} />
              </TimelineVoyage>
            </>
          ))}

        <TimelineIcon icon="PORT" color={dischargePortArrivalColoring} />

        <TimelineLine color={customClearanceColoring} />

        <TimelineIcon icon="CUSTOMS" color={customClearanceColoring} />

        <TimelineLine color={warehouseArrivalColoring} />

        <TimelineIcon icon="WAREHOUSE" color={warehouseArrivalColoring} />

        <TimelineLine color={deliveryReadyColoring} />

        <TimelineIcon icon="DELIVERY_READY" color={deliveryReadyColoring} />
      </div>
      <div className={TimelineRightWrapperStyle}>Hi</div>
    </div>
  );
};

export default VerticalTimeline;
