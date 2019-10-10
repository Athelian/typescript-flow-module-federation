// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  getTimelineColoring,
  getTransportIcon,
} from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import {
  CARGO_READY,
  LOAD_PORT_DEPARTURE,
  FIRST_TRANSIT_PORT_ARRIVAL,
  FIRST_TRANSIT_PORT_DEPARTURE,
  SECOND_TRANSIT_PORT_ARRIVAL,
  SECOND_TRANSIT_PORT_DEPARTURE,
  DISCHARGE_PORT_ARRIVAL,
  CUSTOMS_CLEARANCE,
  WAREHOUSE_ARRIVAL,
  DELIVERY_READY,
} from 'modules/relationMapV2/constants';
import {
  MiniShipmentTimelineWrapperStyle,
  TimelinePointWrapperStyle,
  TimelinePointActiveStyle,
  TimelinePointStyle,
  TransitPointWrapperStyle,
  TransitHalfWrapperStyle,
  TransitPointActiveStyle,
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
  activePoint: string,
  onChangeActivePoint: string => void,
|};

export default function MiniShipmentTimeline({
  shipment,
  activePoint,
  onChangeActivePoint,
}: Props) {
  const { transportType, cargoReady, voyages = [{}], containerGroups = [{}], containers = [] } =
    shipment || {};

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
      <button
        onClick={event => {
          event.stopPropagation();
          onChangeActivePoint(CARGO_READY);
        }}
        className={TimelinePointWrapperStyle}
        type="button"
      >
        <div className={TimelinePointActiveStyle(activePoint === CARGO_READY)} />
        <div className={TimelinePointStyle(cargoReadyColoring, activePoint === CARGO_READY)}>
          <Icon icon="CARGO_READY" />
        </div>
      </button>

      <div className={TimelineLineStyle(loadPortDepartureColoring)} />

      <button
        onClick={event => {
          event.stopPropagation();
          onChangeActivePoint(LOAD_PORT_DEPARTURE);
        }}
        className={TimelinePointWrapperStyle}
        type="button"
      >
        <div className={TimelinePointActiveStyle(activePoint === LOAD_PORT_DEPARTURE)} />
        <div
          className={TimelinePointStyle(
            loadPortDepartureColoring,
            activePoint === LOAD_PORT_DEPARTURE
          )}
        >
          <Icon icon="PORT" />
        </div>
      </button>

      <div className={TimelineVoyageWrapperStyle}>
        <div className={TimelineLineStyle(loadPortDepartureColoring)} />
        <div className={TimelineLineStyle(coloring[2])} />
        <div className={TimelineTransportStyle(loadPortDepartureColoring)}>
          <Icon icon={transportIcon} />
        </div>
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map((voyage, index) => (
          <React.Fragment key={voyage?.id || `mini-shipment-timeline-${index}`}>
            <div className={TransitPointWrapperStyle}>
              <div className={TimelinePointStyle(coloring[index * 2 + 2])}>
                <Icon icon="TRANSIT" />
              </div>

              <button
                onClick={event => {
                  event.stopPropagation();
                  onChangeActivePoint(
                    index === 0 ? FIRST_TRANSIT_PORT_ARRIVAL : SECOND_TRANSIT_PORT_ARRIVAL
                  );
                }}
                className={TransitHalfWrapperStyle(
                  'left',
                  index === 0
                    ? activePoint === FIRST_TRANSIT_PORT_ARRIVAL
                    : activePoint === SECOND_TRANSIT_PORT_ARRIVAL
                )}
                type="button"
              >
                <div
                  className={TransitPointActiveStyle(
                    index === 0
                      ? activePoint === FIRST_TRANSIT_PORT_ARRIVAL
                      : activePoint === SECOND_TRANSIT_PORT_ARRIVAL
                  )}
                />
              </button>

              <button
                onClick={event => {
                  event.stopPropagation();
                  onChangeActivePoint(
                    index === 0 ? FIRST_TRANSIT_PORT_DEPARTURE : SECOND_TRANSIT_PORT_DEPARTURE
                  );
                }}
                className={TransitHalfWrapperStyle(
                  'right',
                  index === 0
                    ? activePoint === FIRST_TRANSIT_PORT_DEPARTURE
                    : activePoint === SECOND_TRANSIT_PORT_DEPARTURE
                )}
                type="button"
              >
                <div
                  className={TransitPointActiveStyle(
                    index === 0
                      ? activePoint === FIRST_TRANSIT_PORT_DEPARTURE
                      : activePoint === SECOND_TRANSIT_PORT_DEPARTURE
                  )}
                />
              </button>
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

      <button
        onClick={event => {
          event.stopPropagation();
          onChangeActivePoint(DISCHARGE_PORT_ARRIVAL);
        }}
        className={TimelinePointWrapperStyle}
        type="button"
      >
        <div className={TimelinePointActiveStyle(activePoint === DISCHARGE_PORT_ARRIVAL)} />
        <div
          className={TimelinePointStyle(
            dischargePortArrivalColoring,
            activePoint === DISCHARGE_PORT_ARRIVAL
          )}
        >
          <Icon icon="PORT" />
        </div>
      </button>

      <div className={TimelineLineStyle(customClearanceColoring)} />

      <button
        onClick={event => {
          event.stopPropagation();
          onChangeActivePoint(CUSTOMS_CLEARANCE);
        }}
        className={TimelinePointWrapperStyle}
        type="button"
      >
        <div className={TimelinePointActiveStyle(activePoint === CUSTOMS_CLEARANCE)} />
        <div
          className={TimelinePointStyle(customClearanceColoring, activePoint === CUSTOMS_CLEARANCE)}
        >
          <Icon icon="CUSTOMS" />
        </div>
      </button>

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

          <button
            onClick={event => {
              event.stopPropagation();
              onChangeActivePoint(WAREHOUSE_ARRIVAL);
            }}
            className={TimelinePointWrapperStyle}
            type="button"
          >
            <div className={TimelinePointActiveStyle(activePoint === WAREHOUSE_ARRIVAL)} />
            <div
              className={TimelinePointStyle(
                warehouseArrivalColoring,
                activePoint === WAREHOUSE_ARRIVAL
              )}
            >
              <Icon icon="WAREHOUSE" />
            </div>
          </button>

          <div className={TimelineLineStyle(deliveryReadyColoring)} />
        </>
      )}

      <button
        onClick={event => {
          event.stopPropagation();
          onChangeActivePoint(DELIVERY_READY);
        }}
        className={TimelinePointWrapperStyle}
        type="button"
      >
        <div className={TimelinePointActiveStyle(activePoint === DELIVERY_READY)} />
        <div className={TimelinePointStyle(deliveryReadyColoring, activePoint === DELIVERY_READY)}>
          <Icon icon="DELIVERY_READY" />
        </div>
      </button>
    </div>
  );
}
