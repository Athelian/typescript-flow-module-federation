// @flow
import * as React from 'react';
import { TimelineIcon, TimelineTransitIcon, TimelineLine, TimelineVoyage } from '../../components';
import { getTimelineColoring, getTransportIcon } from '../../helpers';
import { HorizontalTimelineWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const HorizontalTimeline = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, transportType } = shipment;

  const transportIcon = getTransportIcon(transportType);

  const coloring = getTimelineColoring({ cargoReady, voyages, containerGroups });

  const cargoReadyColoring = coloring[0];
  const loadPortDepartureColoring = coloring[1];
  const dischargePortArrivalColoring = coloring[coloring.length - 4];
  const customClearanceColoring = coloring[coloring.length - 3];
  const warehouseArrivalColoring = coloring[coloring.length - 2];
  const deliveryReadyColoring = coloring[coloring.length - 1];

  return (
    <div className={HorizontalTimelineWrapperStyle}>
      <TimelineIcon
        icon="CARGO_READY"
        color={cargoReadyColoring}
        targetId="cargoReady"
        boundaryId="timelineInfoSection"
      />

      <TimelineLine color={loadPortDepartureColoring} />

      <TimelineIcon
        icon="PORT"
        color={loadPortDepartureColoring}
        targetId="loadPortDeparture"
        boundaryId="timelineInfoSection"
      />

      <TimelineVoyage>
        <TimelineLine color={loadPortDepartureColoring} />
        <TimelineLine color={coloring[2]} />
        <TimelineIcon
          icon={transportIcon}
          color={loadPortDepartureColoring}
          targetId="firstVoyage"
          boundaryId="timelineInfoSection"
        />
      </TimelineVoyage>

      {voyages.length > 1 &&
        voyages.slice(1).map((voyage, index) => (
          <React.Fragment key={voyage.id}>
            <TimelineTransitIcon
              color={coloring[index * 2 + 2]}
              arrivalTargetId={index === 0 ? 'firstTransitPortArrival' : 'secondTransitPortArrival'}
              departureTargetId={
                index === 0 ? 'firstTransitPortDeparture' : 'secondTransitPortDeparture'
              }
              boundaryId="timelineInfoSection"
            />

            <TimelineVoyage>
              <TimelineLine color={coloring[index * 2 + 3]} />
              <TimelineLine color={coloring[index * 2 + 4]} />
              <TimelineIcon
                icon={transportIcon}
                color={coloring[index * 2 + 3]}
                targetId={index === 0 ? 'secondVoyage' : 'thirdVoyage'}
                boundaryId="timelineInfoSection"
              />
            </TimelineVoyage>
          </React.Fragment>
        ))}

      <TimelineIcon
        icon="PORT"
        color={dischargePortArrivalColoring}
        targetId="dischargePortArrival"
        boundaryId="timelineInfoSection"
      />

      <TimelineLine color={customClearanceColoring} />

      <TimelineIcon
        icon="CUSTOMS"
        color={customClearanceColoring}
        targetId="customClearance"
        boundaryId="timelineInfoSection"
      />

      <TimelineLine color={warehouseArrivalColoring} />

      <TimelineIcon
        icon="WAREHOUSE"
        color={warehouseArrivalColoring}
        targetId="warehouseArrival"
        boundaryId="timelineInfoSection"
      />

      <TimelineLine color={deliveryReadyColoring} />

      <TimelineIcon
        icon="DELIVERY_READY"
        color={deliveryReadyColoring}
        targetId="deliveryReady"
        boundaryId="timelineInfoSection"
      />
    </div>
  );
};

export default HorizontalTimeline;
