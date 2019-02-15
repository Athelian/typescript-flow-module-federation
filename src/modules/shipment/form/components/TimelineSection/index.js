// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import usePermission from 'hooks/usePermission';
import { SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import {
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import { DashedPlusButton } from 'components/Form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import SlideView from 'components/SlideView';
import { ShipmentWarehouseCard } from 'components/Cards';
import { getTransportIcon } from './components/Timeline/helpers';
import {
  VerticalLayout,
  ContainerWarehouseArrivalSection,
  TimelineInfoSection,
  VoyageInfoSection,
  VoyageSelector,
} from './components';
import { TimelineSectionWrapperStyle, TimelineWrapperStyle, BodyWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TimelineSection = ({ isNew }: Props) => {
  const { hasPermission } = usePermission();
  const allowToUpdate = hasPermission(SHIPMENT_UPDATE);

  return (
    <Subscribe
      to={[ShipmentTimelineContainer, ShipmentTransportTypeContainer, ShipmentContainersContainer]}
    >
      {(
        { originalValues: initialValues, state, setFieldDeepValue, removeArrayItem },
        { state: transportTypeState },
        { state: containersState }
      ) => {
        const values: Object = {
          ...initialValues,
          ...state,
          ...transportTypeState,
          ...containersState,
        };
        const { cargoReady, voyages, containerGroups = [], containers = [] } = values;
        const { customClearance, warehouseArrival, deliveryReady, warehouse } =
          containerGroups[0] || {};

        return (
          <div className={TimelineSectionWrapperStyle}>
            <div className={TimelineWrapperStyle}>
              <VerticalLayout shipment={values} />
              <VoyageSelector
                readOnly={!allowToUpdate}
                shipment={values}
                setFieldDeepValue={setFieldDeepValue}
                removeArrayItem={removeArrayItem}
              />
            </div>
            <div className={BodyWrapperStyle} id="timelineInfoSection">
              <TimelineInfoSection
                id="cargoReady"
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon="CARGO_READY"
                title={
                  <FormattedMessage
                    id="modules.Shipments.cargoReady"
                    defaultMessage="CARGO READY"
                  />
                }
                timelineDate={cargoReady}
                sourceName="cargoReady"
                setFieldDeepValue={setFieldDeepValue}
                removeArrayItem={removeArrayItem}
              />
              <TimelineInfoSection
                id="loadPortDeparture"
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon="PORT"
                title={
                  <FormattedMessage
                    id="modules.Shipments.loadPortDeparture"
                    defaultMessage="LOAD PORT DEPARTURE"
                  />
                }
                timelineDate={voyages[0].departure}
                sourceName="voyages.0.departure"
                setFieldDeepValue={setFieldDeepValue}
                removeArrayItem={removeArrayItem}
              />
              <VoyageInfoSection
                id="firstVoyage"
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon={getTransportIcon(values.transportType)}
                title={
                  values.voyages.length > 1 ? (
                    <FormattedMessage
                      id="modules.Shipments.firstVoyage"
                      defaultMessage="FIRST VOYAGE"
                    />
                  ) : (
                    <FormattedMessage id="modules.Shipments.voyage" defaultMessage="VOYAGE" />
                  )
                }
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
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon="TRANSIT"
                    title={
                      values.voyages.length > 2 ? (
                        <FormattedMessage
                          id="modules.Shipments.firstTransitPortArrival"
                          defaultMessage="FIRST TRANSIT PORT ARRIVAL"
                        />
                      ) : (
                        <FormattedMessage
                          id="modules.Shipments.transitPortArrival"
                          defaultMessage="TRANSIT PORT ARRIVAL"
                        />
                      )
                    }
                    timelineDate={values.voyages[0].arrival}
                    sourceName="voyages.0.arrival"
                    setFieldDeepValue={setFieldDeepValue}
                    removeArrayItem={removeArrayItem}
                  />
                  <TimelineInfoSection
                    id="firstTransitPortDeparture"
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon="TRANSIT"
                    title={
                      values.voyages.length > 2 ? (
                        <FormattedMessage
                          id="modules.Shipments.firstTransitPortDeparture"
                          defaultMessage="FIRST TRANSIT PORT DEPARTURE"
                        />
                      ) : (
                        <FormattedMessage
                          id="modules.Shipments.transitPortDeparture"
                          defaultMessage="TRANSIT PORT DEPARTURE"
                        />
                      )
                    }
                    timelineDate={values.voyages[1].departure}
                    sourceName="voyages.1.departure"
                    setFieldDeepValue={setFieldDeepValue}
                    removeArrayItem={removeArrayItem}
                  />
                  <VoyageInfoSection
                    id="secondVoyage"
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon={getTransportIcon(values.transportType)}
                    title={
                      <FormattedMessage
                        id="modules.Shipments.secondVoyage"
                        defaultMessage="SECOND VOYAGE"
                      />
                    }
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
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon="TRANSIT"
                    title={
                      <FormattedMessage
                        id="modules.Shipments.secondTransitPortArrival"
                        defaultMessage="SECOND TRANSIT PORT ARRIVAL"
                      />
                    }
                    timelineDate={values.voyages[1].arrival}
                    sourceName="voyages.1.arrival"
                    setFieldDeepValue={setFieldDeepValue}
                    removeArrayItem={removeArrayItem}
                  />
                  <TimelineInfoSection
                    id="secondTransitPortDeparture"
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon="TRANSIT"
                    title={
                      <FormattedMessage
                        id="modules.Shipments.secondTransitPortDeparture"
                        defaultMessage="SECOND TRANSIT PORT DEPARTURE"
                      />
                    }
                    timelineDate={values.voyages[2].departure}
                    sourceName="voyages.2.departure"
                    setFieldDeepValue={setFieldDeepValue}
                    removeArrayItem={removeArrayItem}
                  />
                  <VoyageInfoSection
                    id="thirdVoyage"
                    readOnly={!allowToUpdate}
                    isNew={isNew}
                    icon={getTransportIcon(values.transportType)}
                    title={
                      <FormattedMessage
                        id="modules.Shipments.thirdVoyage"
                        defaultMessage="THIRD VOYAGE"
                      />
                    }
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
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon="PORT"
                title={
                  <FormattedMessage
                    id="modules.Shipments.dischargePortArrival"
                    defaultMessage="DISCHARGE PORT ARRIVAL"
                  />
                }
                timelineDate={values.voyages[voyages.length - 1].arrival}
                sourceName={`voyages.${voyages.length - 1}.arrival`}
                setFieldDeepValue={setFieldDeepValue}
                removeArrayItem={removeArrayItem}
              />
              <TimelineInfoSection
                id="customClearance"
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon="CUSTOMS"
                title={
                  <FormattedMessage
                    id="modules.Shipments.customsClearance"
                    defaultMessage="CUSTOMS CLEARANCE"
                  />
                }
                timelineDate={customClearance}
                sourceName="containerGroups.0.customClearance"
                setFieldDeepValue={setFieldDeepValue}
                removeArrayItem={removeArrayItem}
              />
              {containers && containers.length > 0 ? (
                <ContainerWarehouseArrivalSection readOnly={!allowToUpdate} />
              ) : (
                <TimelineInfoSection
                  readOnly={!allowToUpdate}
                  id="warehouseArrival"
                  isNew={isNew}
                  icon="WAREHOUSE"
                  title={
                    <FormattedMessage
                      id="modules.Shipments.warehouseArrival"
                      defaultMessage="WAREHOUSE ARRIVAL"
                    />
                  }
                  timelineDate={warehouseArrival}
                  sourceName="containerGroups.0.warehouseArrival"
                  setFieldDeepValue={setFieldDeepValue}
                  removeArrayItem={removeArrayItem}
                  renderBelowHeader={
                    <BooleanValue>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          {!warehouse ? (
                            <DashedPlusButton
                              width="195px"
                              height="40px"
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
                  }
                />
              )}
              <TimelineInfoSection
                id="deliveryReady"
                readOnly={!allowToUpdate}
                isNew={isNew}
                icon="DELIVERY_READY"
                title={
                  <FormattedMessage
                    id="modules.Shipments.deliveryReady"
                    defaultMessage="DELIVERY READY"
                  />
                }
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
};
export default TimelineSection;
