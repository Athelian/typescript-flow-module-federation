// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import {
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
} from 'modules/shipment/form/containers';
import { getTransportIcon } from './components/Timeline/helpers';
import {
  VerticalLayout,
  TimelineInfoSection,
  VoyageInfoSection,
  VoyageSelector,
} from './components';
import { TimelineSectionWrapperStyle, TimelineWrapperStyle, BodyWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TimelineSection = ({ isNew }: Props) => (
  <Subscribe to={[ShipmentTimelineContainer, ShipmentTransportTypeContainer]}>
    {(shipmentTimelineState, shipmentTransportTypeState) => {
      const {
        originalValues: initialValues,
        state,
        /* setFieldDeepValue,
        removeArrayItem, */
      } = shipmentTimelineState;

      const {
        originalValues: transportTypeInitialValues,
        state: transportTypeState,
      } = shipmentTransportTypeState;

      const values = {
        ...initialValues,
        ...state,
        ...transportTypeInitialValues,
        ...transportTypeState,
      };
      const { cargoReady, voyages, containerGroups } = values;
      const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

      return (
        <div className={TimelineSectionWrapperStyle}>
          <div className={TimelineWrapperStyle}>
            <VerticalLayout shipment={values} />
            <VoyageSelector shipment={values} />
          </div>
          <div className={BodyWrapperStyle} id="timelineInfoSection">
            <TimelineInfoSection
              id="cargoReady"
              isNew={isNew}
              icon="CARGO_READY"
              title="CARGO READY"
              timelineDate={cargoReady}
            />
            <TimelineInfoSection
              id="loadPortDeparture"
              isNew={isNew}
              icon="PORT"
              title="LOAD PORT DEPARTURE"
              timelineDate={values.voyages[0].departure}
            />
            <VoyageInfoSection
              id="firstVoyage"
              isNew={isNew}
              icon={getTransportIcon(values.transportType)}
              title={values.voyages.length > 1 ? 'FIRST VOYAGE' : 'VOYAGE'}
            />

            {values.voyages.length > 1 && (
              <>
                <TimelineInfoSection
                  id="firstTransitPortArrival"
                  isNew={isNew}
                  icon="TRANSIT"
                  title={
                    values.voyages.length > 2
                      ? 'FIRST TRANSIT PORT ARRIVAL'
                      : 'TRANSIT PORT ARRIVAL'
                  }
                  timelineDate={values.voyages[0].arrival}
                />
                <TimelineInfoSection
                  id="firstTransitPortDeparture"
                  isNew={isNew}
                  icon="TRANSIT"
                  title={
                    values.voyages.length > 2
                      ? 'FIRST TRANSIT PORT DEPARTURE'
                      : 'TRANSIT PORT DEPARTURE'
                  }
                  timelineDate={values.voyages[1].departure}
                />
                <VoyageInfoSection
                  id="secondVoyage"
                  isNew={isNew}
                  icon={getTransportIcon(values.transportType)}
                  title="SECOND VOYAGE"
                />
              </>
            )}

            {values.voyages.length > 2 && (
              <>
                <TimelineInfoSection
                  id="secondTransitPortArrival"
                  isNew={isNew}
                  icon="TRANSIT"
                  title="SECOND TRANSIT PORT ARRIVAL"
                  timelineDate={values.voyages[1].arrival}
                />
                <TimelineInfoSection
                  id="secondTransitPortDeparture"
                  isNew={isNew}
                  icon="TRANSIT"
                  title="SECOND TRANSIT PORT DEPARTURE"
                  timelineDate={values.voyages[2].departure}
                />
                <VoyageInfoSection
                  id="thirdVoyage"
                  isNew={isNew}
                  icon={getTransportIcon(values.transportType)}
                  title="THIRD VOYAGE"
                />
              </>
            )}

            <TimelineInfoSection
              id="dischargePortArrival"
              isNew={isNew}
              icon="PORT"
              title="DISCHARGE PORT ARRIVAL"
              timelineDate={values.voyages[voyages.length - 1].arrival}
            />
            <TimelineInfoSection
              id="customClearance"
              isNew={isNew}
              icon="CUSTOMS"
              title="CUSTOMS CLEARANCE"
              timelineDate={customClearance}
            />
            <TimelineInfoSection
              id="warehouseArrival"
              isNew={isNew}
              icon="WAREHOUSE"
              title="WAREHOUSE ARRIVAL"
              timelineDate={warehouseArrival}
            />
            <TimelineInfoSection
              id="deliveryReady"
              isNew={isNew}
              icon="DELIVERY_READY"
              title="DELIVERY READY"
              timelineDate={deliveryReady}
            />
          </div>
        </div>
      );
    }}
  </Subscribe>
);

export default TimelineSection;
