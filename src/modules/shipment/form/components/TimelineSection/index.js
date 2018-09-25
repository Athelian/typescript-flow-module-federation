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
    {(
      { originalValues: initialValues, state, setFieldDeepValue, removeArrayItem },
      { state: transportTypeState }
    ) => {
      const values: Object = {
        ...initialValues,
        ...state,
        ...transportTypeState,
      };

      const { cargoReady, voyages, containerGroups = [] } = values;
      const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

      return (
        <div className={TimelineSectionWrapperStyle}>
          <div className={TimelineWrapperStyle}>
            <VerticalLayout shipment={values} />
            <VoyageSelector
              shipment={values}
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
          </div>
          <div className={BodyWrapperStyle} id="timelineInfoSection">
            <TimelineInfoSection
              id="cargoReady"
              isNew={isNew}
              icon="CARGO_READY"
              title="CARGO READY"
              timelineDate={cargoReady}
              sourceName="cargoReady"
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
            <TimelineInfoSection
              id="loadPortDeparture"
              isNew={isNew}
              icon="PORT"
              title="LOAD PORT DEPARTURE"
              timelineDate={voyages[0].departure}
              sourceName="voyages.0.departure"
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
            <VoyageInfoSection
              id="firstVoyage"
              isNew={isNew}
              icon={getTransportIcon(values.transportType)}
              title={values.voyages.length > 1 ? 'FIRST VOYAGE' : 'VOYAGE'}
              voyage={voyages[0]}
              initialVoyage={initialValues.voyages[0]}
              sourceName="voyages.0"
              setFieldDeepValue={setFieldDeepValue}
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
                  sourceName="voyages.0.arrival"
                  setFieldDeepValue={setFieldDeepValue}
                  removeArrayItem={removeArrayItem}
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
                  sourceName="voyages.1.departure"
                  setFieldDeepValue={setFieldDeepValue}
                  removeArrayItem={removeArrayItem}
                />
                <VoyageInfoSection
                  id="secondVoyage"
                  isNew={isNew}
                  icon={getTransportIcon(values.transportType)}
                  title="SECOND VOYAGE"
                  voyage={voyages[1]}
                  initialVoyage={initialValues.voyages[1]}
                  sourceName="voyages.1"
                  setFieldDeepValue={setFieldDeepValue}
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
                  sourceName="voyages.1.arrival"
                  setFieldDeepValue={setFieldDeepValue}
                  removeArrayItem={removeArrayItem}
                />
                <TimelineInfoSection
                  id="secondTransitPortDeparture"
                  isNew={isNew}
                  icon="TRANSIT"
                  title="SECOND TRANSIT PORT DEPARTURE"
                  timelineDate={values.voyages[2].departure}
                  sourceName="voyages.2.departure"
                  setFieldDeepValue={setFieldDeepValue}
                  removeArrayItem={removeArrayItem}
                />
                <VoyageInfoSection
                  id="thirdVoyage"
                  isNew={isNew}
                  icon={getTransportIcon(values.transportType)}
                  title="THIRD VOYAGE"
                  voyage={voyages[2]}
                  initialVoyage={initialValues.voyages[2]}
                  sourceName="voyages.2"
                  setFieldDeepValue={setFieldDeepValue}
                />
              </>
            )}

            <TimelineInfoSection
              id="dischargePortArrival"
              isNew={isNew}
              icon="PORT"
              title="DISCHARGE PORT ARRIVAL"
              timelineDate={values.voyages[voyages.length - 1].arrival}
              sourceName={`voyages.${voyages.length - 1}.arrival`}
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
            <TimelineInfoSection
              id="customClearance"
              isNew={isNew}
              icon="CUSTOMS"
              title="CUSTOMS CLEARANCE"
              timelineDate={customClearance}
              sourceName="containerGroups.0.customClearance"
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
            <TimelineInfoSection
              id="warehouseArrival"
              isNew={isNew}
              icon="WAREHOUSE"
              title="WAREHOUSE ARRIVAL"
              timelineDate={warehouseArrival}
              sourceName="containerGroups.0.warehouseArrival"
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
            <TimelineInfoSection
              id="deliveryReady"
              isNew={isNew}
              icon="DELIVERY_READY"
              title="DELIVERY READY"
              timelineDate={deliveryReady}
              sourceName="containerGroups.0.deliveryReady"
              setFieldDeepValue={setFieldDeepValue}
              removeArrayItem={removeArrayItem}
            />
          </div>
        </div>
      );
    }}
  </Subscribe>
);

export default TimelineSection;
