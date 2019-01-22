// @flow
import * as React from 'react';
import { encodeId } from 'utils/id';
import { isEnableBetaFeature } from 'utils/env';
import {
  TimelineIcon,
  TimelineTransitIcon,
  TimelineLine,
  TimelineVoyage,
  TimelineWarehouseContainerIcon,
  TimelineContainerIcon,
} from '../../components';
import { getTimelineColoring, getTransportIcon } from '../../helpers';
import {
  HorizontalTimelineWrapperStyle,
  BlankSpaceStyle,
  ContainerIconWrapperStyle,
  WarehouseContainerWrapperStyle,
} from './style';

type Props = {
  shipment: any,
};

const HorizontalTimeline = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, transportType, containers } = shipment;

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
      <div className={BlankSpaceStyle} />

      <TimelineIcon
        icon="CARGO_READY"
        color={cargoReadyColoring}
        linkPath={`/shipment/${encodeId(shipment.id)}/cargoReady`}
      />

      <TimelineLine color={loadPortDepartureColoring} />

      <TimelineIcon
        icon="PORT"
        color={loadPortDepartureColoring}
        linkPath={`/shipment/${encodeId(shipment.id)}/loadPortDeparture`}
      />

      <TimelineVoyage>
        <TimelineLine color={loadPortDepartureColoring} />
        <TimelineLine color={coloring[2]} />
        <TimelineIcon
          icon={transportIcon}
          color={loadPortDepartureColoring}
          linkPath={`/shipment/${encodeId(shipment.id)}/firstVoyage`}
        />
      </TimelineVoyage>

      {voyages.length > 1 &&
        voyages.slice(1).map((voyage, index) => (
          <React.Fragment key={voyage.id}>
            <TimelineTransitIcon
              color={coloring[index * 2 + 2]}
              arrivalLinkPath={`/shipment/${encodeId(shipment.id)}/${
                index === 0 ? 'firstTransitPortArrival' : 'secondTransitPortArrival'
              }`}
              departureLinkPath={`/shipment/${encodeId(shipment.id)}/${
                index === 0 ? 'firstTransitPortDeparture' : 'secondTransitPortDeparture'
              }`}
            />

            <TimelineVoyage>
              <TimelineLine color={coloring[index * 2 + 3]} />
              <TimelineLine color={coloring[index * 2 + 4]} />
              <TimelineIcon
                icon={transportIcon}
                color={coloring[index * 2 + 3]}
                linkPath={`/shipment/${encodeId(shipment.id)}/${
                  index === 0 ? 'secondVoyage' : 'thirdVoyage'
                }`}
              />
            </TimelineVoyage>
          </React.Fragment>
        ))}

      <TimelineIcon
        icon="PORT"
        color={dischargePortArrivalColoring}
        linkPath={`/shipment/${encodeId(shipment.id)}/dischargePortArrival`}
      />

      <TimelineLine color={customClearanceColoring} />

      <TimelineIcon
        icon="CUSTOMS"
        color={customClearanceColoring}
        linkPath={`/shipment/${encodeId(shipment.id)}/customClearance`}
      />

      <TimelineLine color={warehouseArrivalColoring} />

      {isEnableBetaFeature && containers && containers.length > 0 ? (
        <div className={WarehouseContainerWrapperStyle}>
          <div className={ContainerIconWrapperStyle}>
            <TimelineContainerIcon />
          </div>
          <TimelineWarehouseContainerIcon containers={containers} />
        </div>
      ) : (
        <TimelineIcon
          icon="WAREHOUSE"
          color={warehouseArrivalColoring}
          linkPath={`/shipment/${encodeId(shipment.id)}/warehouseArrival`}
        />
      )}

      <TimelineLine color={deliveryReadyColoring} />

      <TimelineIcon
        icon="DELIVERY_READY"
        color={deliveryReadyColoring}
        linkPath={`/shipment/${encodeId(shipment.id)}/deliveryReady`}
      />

      <div className={BlankSpaceStyle} />
    </div>
  );
};

export default HorizontalTimeline;
