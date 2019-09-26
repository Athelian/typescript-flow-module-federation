// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  getTimelineColoring,
  getTransportIcon,
} from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import {
  MiniShipmentTimelineWrapperStyle,
  TimelinePointStyle,
  TimelineLineStyle,
  TimelineVoyageWrapperStyle,
  TimelineTransportStyle,
  ContainerIconWrapperStyle,
  WarehouseContainerWrapperStyle,
  TimelineRingWrapperStyle,
  TimelineBarStyle,
  TimelineFillStyle,
} from './style';

type Props = {|
  shipment: Object,
|};

export default function MiniShipmentTimeline({ shipment }: Props) {
  const {
    transportType,
    cargoReady,
    voyages = [],
    containerGroups = [],
    containers = [],
  } = shipment;

  const transportIcon = getTransportIcon(transportType);
  const coloring = getTimelineColoring({ cargoReady, voyages, containerGroups });

  const cargoReadyColoring = coloring[0];
  const loadPortDepartureColoring = coloring[1];
  const dischargePortArrivalColoring = coloring[coloring.length - 4];
  const customClearanceColoring = coloring[coloring.length - 3];
  const warehouseArrivalColoring = coloring[coloring.length - 2];
  const deliveryReadyColoring = coloring[coloring.length - 1];

  let warehouseContainerPercent = 0;
  containers.forEach(container => {
    if (container?.warehouseArrivalActualDateApprovedAt) {
      warehouseContainerPercent += (1 / containers.length) * 100;
    }
  });

  return (
    <div className={MiniShipmentTimelineWrapperStyle}>
      <div className={TimelinePointStyle(cargoReadyColoring)}>
        <Icon icon="CARGO_READY" />
      </div>

      <div className={TimelineLineStyle(loadPortDepartureColoring)} />

      <div className={TimelinePointStyle(loadPortDepartureColoring)}>
        <Icon icon="PORT" />
      </div>

      <div className={TimelineVoyageWrapperStyle}>
        <div className={TimelineLineStyle(loadPortDepartureColoring)} />
        <div className={TimelineLineStyle(coloring[2])} />
        <div className={TimelineTransportStyle(loadPortDepartureColoring)}>
          <Icon icon={transportIcon} />
        </div>
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map((voyage, index) => (
          <React.Fragment key={voyage?.id}>
            <div className={TimelinePointStyle(coloring[index * 2 + 2])}>
              <Icon icon="TRANSIT" />
            </div>

            <div className={TimelineVoyageWrapperStyle}>
              <div className={TimelineLineStyle(coloring[index * 2 + 3])} />
              <div className={TimelineLineStyle(coloring[index * 2 + 4])} />
              <div className={TimelineTransportStyle(coloring[index * 2 + 3])}>
                <Icon icon={transportIcon} />
              </div>
            </div>
          </React.Fragment>
        ))}

      <div className={TimelinePointStyle(dischargePortArrivalColoring)}>
        <Icon icon="PORT" />
      </div>

      <div className={TimelineLineStyle(customClearanceColoring)} />

      <div className={TimelinePointStyle(customClearanceColoring)}>
        <Icon icon="CUSTOMS" />
      </div>

      {containers.length > 0 ? (
        <>
          <div className={TimelineLineStyle(warehouseArrivalColoring)} />

          <div className={WarehouseContainerWrapperStyle}>
            <div className={ContainerIconWrapperStyle}>
              <Icon icon="CONTAINER" />
            </div>

            <div
              className={TimelinePointStyle(
                warehouseContainerPercent < 100 ? 'GRAY_LIGHT' : 'TEAL'
              )}
            >
              <Icon icon="WAREHOUSE" />

              <div className={TimelineRingWrapperStyle(warehouseContainerPercent)}>
                <div className={TimelineBarStyle(warehouseContainerPercent)} />
                <div className={TimelineFillStyle(warehouseContainerPercent)} />
              </div>
            </div>
          </div>

          <div className={TimelineLineStyle(deliveryReadyColoring)} />
        </>
      ) : (
        <>
          <div className={TimelineLineStyle(warehouseArrivalColoring)} />

          <div className={TimelinePointStyle(warehouseArrivalColoring)}>
            <Icon icon="WAREHOUSE" />
          </div>

          <div className={TimelineLineStyle(deliveryReadyColoring)} />
        </>
      )}

      <div className={TimelinePointStyle(deliveryReadyColoring)}>
        <Icon icon="DELIVERY_READY" />
      </div>
    </div>
  );
}
