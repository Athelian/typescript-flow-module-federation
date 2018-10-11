// @flow
import * as React from 'react';
import {
  TimelineIcon,
  TimelinePortName,
  TimelineLine,
  TimelineVoyage,
  TimelineDate,
} from '../components';
import { getTimelineColoring, getTransportIcon } from '../helpers';
import {
  TimelineLayoutWrapperStyle,
  LineOdd,
  LineEven,
  TimelineIconWrapperStyle,
  TimelineIconName,
  TimelineIconDate,
} from './style';

type Props = {
  shipment: any,
};

const TimelineLayout = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, transportType } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

  const transportIcon = getTransportIcon(transportType);

  const coloring = getTimelineColoring({ cargoReady, voyages, containerGroups });

  const cargoReadyColoring = coloring[0];
  const loadPortDepartureColoring = coloring[1];
  const dischargePortArrivalColoring = coloring[coloring.length - 4];
  const customClearanceColoring = coloring[coloring.length - 3];
  const warehouseArrivalColoring = coloring[coloring.length - 2];
  const deliveryReadyColoring = coloring[coloring.length - 1];

  const odds = [];
  const evens = [];

  const loadPort = voyages[0];
  const dischargePort = voyages[voyages.length - 1];
  let turnAroundLineColor = 'GRAY_LIGHT';

  if (voyages && voyages.length && voyages.length > 1) {
    const voyagesNo = voyages.length - 1;
    voyages.slice(1).forEach((voyage, index) => {
      const renderer = (
        <React.Fragment key={voyage.id}>
          <div className={TimelineIconWrapperStyle}>
            <div className={TimelineIconName}>
              <TimelinePortName
                port={voyage.departurePort[(transportType || '').toLowerCase()] || ''}
                color={coloring[index * 2 + 2]}
              />
            </div>
            <TimelineIcon
              icon="TRANSIT"
              color={coloring[index * 2 + 2]}
              boundaryId="timelineInfoSection"
            />
            <div className={TimelineIconDate}>
              <TimelineDate timelineDate={voyage.arrival} />
              <TimelineDate timelineDate={voyage.departure} />
            </div>
          </div>

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
      );
      if (index < voyagesNo / 2) {
        odds.push(renderer);
      } else {
        evens.push(renderer);
      }

      if (index === parseInt(voyagesNo, 10) - 1) {
        evens.unshift(<TimelineLine key={voyagesNo} color={coloring[index * 2 + 2]} />);
        turnAroundLineColor = coloring[index * 2 + 2];
      }
    });
  }
  return (
    <div className={TimelineLayoutWrapperStyle} role="presentation">
      <div className={LineOdd(turnAroundLineColor)}>
        <div className={TimelineIconWrapperStyle}>
          <TimelineIcon
            icon="CARGO_READY"
            color={cargoReadyColoring}
            targetId="cargoReady"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={cargoReady} />
          </div>
        </div>

        <TimelineLine color={loadPortDepartureColoring} />

        <div className={TimelineIconWrapperStyle}>
          <div className={TimelineIconName}>
            <TimelinePortName
              port={loadPort.departurePort[transportType]}
              color={loadPortDepartureColoring}
            />
          </div>
          <TimelineIcon
            icon="PORT"
            color={loadPortDepartureColoring}
            targetId="loadPortDeparture"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={loadPort.departure} />
          </div>
        </div>

        <TimelineVoyage>
          <TimelineLine color={loadPortDepartureColoring} />
          <TimelineIcon
            icon={transportIcon}
            color={loadPortDepartureColoring}
            targetId="firstVoyage"
            boundaryId="timelineInfoSection"
          />
          <TimelineLine color={coloring[2]} />
        </TimelineVoyage>

        {odds}
      </div>

      <div className={LineEven(turnAroundLineColor)}>
        {evens}

        <div className={TimelineIconWrapperStyle}>
          <TimelineIcon
            icon="PORT"
            color={dischargePortArrivalColoring}
            targetId="dischargePortArrival"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={dischargePort.departure} />
          </div>
        </div>

        <TimelineLine color={customClearanceColoring} />

        <div className={TimelineIconWrapperStyle}>
          <TimelineIcon
            icon="CUSTOMS"
            color={customClearanceColoring}
            targetId="customClearance"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={customClearance} />
          </div>
        </div>

        <TimelineLine color={warehouseArrivalColoring} />

        <div className={TimelineIconWrapperStyle}>
          <TimelineIcon
            icon="WAREHOUSE"
            color={warehouseArrivalColoring}
            targetId="warehouseArrival"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={warehouseArrival} />
          </div>
        </div>

        <TimelineLine color={deliveryReadyColoring} />

        <div className={TimelineIconWrapperStyle}>
          <TimelineIcon
            icon="DELIVERY_READY"
            color={deliveryReadyColoring}
            targetId="deliveryReady"
            boundaryId="timelineInfoSection"
          />
          <div className={TimelineIconDate}>
            <TimelineDate timelineDate={deliveryReady} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineLayout;
