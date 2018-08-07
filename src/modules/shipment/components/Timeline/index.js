// @flow
import * as React from 'react';
import type { ShipmentTimeline } from 'modules/shipment/type.js.flow';
import { getPortName, getColoring } from '../helpers';
import TimelineItem from './TimelineItem';
import TimelineTransitItem from './TimelineTransitItem';
import { TimelineWrapperStyle } from './style';

type Props = {
  shipment: ShipmentTimeline,
  onStepClick: number => void,
};

const Timeline = ({ shipment, onStepClick }: Props) => {
  const {
    customClearanceDate,
    warehouseArrivalDate,
    deliveryReadyDate,
    warehouse,
  } = shipment.containerGroups[0];

  const arrayOfColors = getColoring(shipment);

  return (
    <div className={TimelineWrapperStyle}>
      <TimelineItem
        header={shipment.exporter && shipment.exporter.name}
        icon="faCargoReady"
        timelineDate={shipment.cargoReadyDate}
        color={arrayOfColors[0]}
        align="left"
        onClick={() => onStepClick(0)}
      />
      <TimelineItem
        header={getPortName(shipment.transportType, shipment.voyages[0].departurePort)}
        icon="faPort"
        timelineDate={shipment.voyages[0].departureDate}
        showVoyageIcon
        transportType={shipment.transportType}
        color={arrayOfColors[1]}
        align="left"
        onClick={i => onStepClick(i)}
        portIndex={1}
      />
      {shipment.voyages.map((voyage, index) => {
        if (index === 0) return '';
        return (
          <TimelineTransitItem
            key={voyage.id || index}
            transportType={shipment.transportType}
            leftVoyage={shipment.voyages[index - 1]}
            rightVoyage={voyage}
            leftColor={arrayOfColors[index * 2]}
            rightColor={arrayOfColors[index * 2 + 1]}
            portIndex={index * 2 + 1}
            onClick={i => onStepClick(i)}
          />
        );
      })}
      <TimelineItem
        header={getPortName(
          shipment.transportType,
          shipment.voyages[shipment.voyages.length - 1].arrivalPort
        )}
        icon="faPort"
        timelineDate={shipment.voyages[shipment.voyages.length - 1].arrivalDate}
        color={arrayOfColors[arrayOfColors.length - 4]}
        align="right"
        onClick={() => onStepClick(arrayOfColors.length - 3)}
      />
      <TimelineItem
        icon="faCustoms"
        timelineDate={customClearanceDate}
        color={arrayOfColors[arrayOfColors.length - 3]}
        align="right"
        onClick={() => onStepClick(arrayOfColors.length - 2)}
      />
      <TimelineItem
        header={warehouse && warehouse.name}
        icon="faWarehouse"
        timelineDate={warehouseArrivalDate}
        color={arrayOfColors[arrayOfColors.length - 2]}
        align="right"
        onClick={() => onStepClick(arrayOfColors.length - 1)}
      />
      <TimelineItem
        icon="faTruckLoading"
        timelineDate={deliveryReadyDate}
        color={arrayOfColors[arrayOfColors.length - 1]}
        align="right"
        onClick={() => onStepClick(arrayOfColors.length)}
      />
    </div>
  );
};

export default Timeline;
