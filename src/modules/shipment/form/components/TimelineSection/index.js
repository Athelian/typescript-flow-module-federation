// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import {
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
} from 'modules/shipment/form/containers';
import { DashedPlusButton } from 'components/Form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import SlideView from 'components/SlideView';
import { ShipmentWarehouseCard } from 'components/Cards';
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
      const { customClearance, warehouseArrival, deliveryReady, warehouse } =
        containerGroups[0] || {};

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
              setFieldDeepValue={(field, newValue) => {
                setFieldDeepValue(field, newValue);
                if (field.includes('arrivalPort') && values.voyages.length > 1) {
                  setFieldDeepValue(field.replace('0.arrivalPort', '1.departurePort'), newValue);
                }
              }}
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
                  timelineDate={values.voyages[1].arrival}
                  sourceName="voyages.1.arrival"
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
                  setFieldDeepValue={(field, newValue) => {
                    setFieldDeepValue(field, newValue);
                    if (field.includes('arrivalPort') && values.voyages.length > 2) {
                      setFieldDeepValue(
                        field.replace('1.arrivalPort', '2.departurePort'),
                        newValue
                      );
                    }
                    if (field.includes('departurePort')) {
                      setFieldDeepValue(
                        field.replace('1.departurePort', '0.arrivalPort'),
                        newValue
                      );
                    }
                  }}
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
                  timelineDate={values.voyages[2].arrival}
                  sourceName="voyages.2.arrival"
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
                  setFieldDeepValue={(field, newValue) => {
                    setFieldDeepValue(field, newValue);
                    if (field.includes('departurePort')) {
                      setFieldDeepValue(
                        field.replace('2.departurePort', '1.arrivalPort'),
                        newValue
                      );
                    }
                  }}
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
              renderBelowHeader={
                <>
                  <BooleanValue>
                    {({ value: opened, set: slideToggle }) => (
                      <>
                        {!warehouse ? (
                          <DashedPlusButton
                            width="200px"
                            height="100px"
                            onClick={() => slideToggle(true)}
                          />
                        ) : (
                          <ShipmentWarehouseCard
                            warehouse={warehouse}
                            onClick={() => slideToggle(true)}
                          />
                        )}

                        <SlideView
                          isOpen={opened}
                          onRequestClose={() => slideToggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {opened && (
                            <SelectWareHouse
                              selected={warehouse}
                              onCancel={() => slideToggle(false)}
                              onSelect={newValue => {
                                slideToggle(false);
                                setFieldDeepValue('containerGroups.0.warehouse', newValue);
                              }}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                </>
              }
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
