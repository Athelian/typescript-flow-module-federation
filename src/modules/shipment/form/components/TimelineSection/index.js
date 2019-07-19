// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import emitter from 'utils/emitter';
import usePrevious from 'hooks/usePrevious';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { getByPath } from 'utils/fp';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_VOYAGES,
  SHIPMENT_SET_WAREHOUSE,
} from 'modules/permission/constants/shipment';
import {
  ShipmentInfoContainer,
  ShipmentTransportTypeContainer,
  ShipmentTimelineContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import { DashedPlusButton, SectionHeader } from 'components/Form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import { ShipmentWarehouseCard } from 'components/Cards';
import { Tooltip } from 'components/Tooltip';
import { WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import { getTransportIcon } from './components/Timeline/helpers';
import {
  VerticalLayout,
  ContainerWarehouseArrivalSection,
  TimelineInfoSection,
  DischargePortArrival,
  VoyageInfoSection,
  VoyageSelector,
} from './components';
import {
  TimelineSectionWrapperStyle,
  TimelineWrapperStyle,
  BodyWrapperStyle,
  WarehouseArrivalInfoIconStyle,
} from './style';

type Props = {|
  isNew: boolean,
  isTaskReadyForBinding: boolean,
|};

const TimelineSection = ({ isNew, isTaskReadyForBinding }: Props) => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowToUpdate = hasPermission(SHIPMENT_UPDATE);

  const allowSetWarehouse =
    hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_WAREHOUSE]) && hasPermission(WAREHOUSE_LIST);

  const prevValue = usePrevious(isTaskReadyForBinding);
  React.useEffect(() => {
    if (!prevValue && isTaskReadyForBinding) {
      setTimeout(() => {
        emitter.emit('AUTO_DATE');
      }, 400);
    }
  });

  return (
    <>
      <SectionHeader
        icon="TIMELINE"
        title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
      />
      <Subscribe
        to={[
          ShipmentTimelineContainer,
          ShipmentInfoContainer,
          ShipmentTransportTypeContainer,
          ShipmentContainersContainer,
        ]}
      >
        {(
          { originalValues: initialValues, state, setFieldDeepValue, removeArrayItem },
          { state: shipment },
          { state: transportTypeState },
          { state: containersState, setFieldValue: setShipmentContainers }
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
                  editable={hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_VOYAGES])}
                  shipment={values}
                  setFieldDeepValue={setFieldDeepValue}
                  setShipmentContainers={setShipmentContainers}
                  shipmentContainers={values.containers}
                  removeArrayItem={removeArrayItem}
                />
              </div>
              <div className={BodyWrapperStyle} id="timelineInfoSection">
                <TimelineInfoSection
                  id="cargoReady"
                  groupIds={[
                    getByPath('importer.id', shipment),
                    getByPath('exporter.id', shipment),
                  ].filter(Boolean)}
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
                  groupIds={[
                    getByPath('importer.id', shipment),
                    getByPath('exporter.id', shipment),
                  ].filter(Boolean)}
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
                      setFieldDeepValue(
                        field.replace('0.arrivalPort', '1.departurePort'),
                        newValue
                      );
                    }
                  }}
                />

                {values.voyages.length > 1 && (
                  <>
                    <TimelineInfoSection
                      id="firstTransitPortArrival"
                      groupIds={[
                        getByPath('importer.id', shipment),
                        getByPath('exporter.id', shipment),
                      ].filter(Boolean)}
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
                      groupIds={[
                        getByPath('importer.id', shipment),
                        getByPath('exporter.id', shipment),
                      ].filter(Boolean)}
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
                      groupIds={[
                        getByPath('importer.id', shipment),
                        getByPath('exporter.id', shipment),
                      ].filter(Boolean)}
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
                      groupIds={[
                        getByPath('importer.id', shipment),
                        getByPath('exporter.id', shipment),
                      ].filter(Boolean)}
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

                <DischargePortArrival
                  id="dischargePortArrival"
                  groupIds={[
                    getByPath('importer.id', shipment),
                    getByPath('exporter.id', shipment),
                  ].filter(Boolean)}
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
                  setShipmentContainers={setShipmentContainers}
                  shipmentContainers={values.containers}
                  removeArrayItem={removeArrayItem}
                />
                <TimelineInfoSection
                  id="customClearance"
                  groupIds={[
                    getByPath('importer.id', shipment),
                    getByPath('exporter.id', shipment),
                  ].filter(Boolean)}
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
                    id="warehouseArrival"
                    groupIds={[
                      getByPath('importer.id', shipment),
                      getByPath('exporter.id', shipment),
                    ].filter(Boolean)}
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
                      <>
                        {allowSetWarehouse ? (
                          <BooleanValue>
                            {({ value: opened, set: slideToggle }) => (
                              <>
                                {warehouse ? (
                                  <ShipmentWarehouseCard
                                    warehouse={warehouse}
                                    onClick={() => slideToggle(true)}
                                  />
                                ) : (
                                  <DashedPlusButton
                                    width="195px"
                                    height="40px"
                                    onClick={() => slideToggle(true)}
                                  />
                                )}
                                <SlideView
                                  isOpen={opened}
                                  onRequestClose={() => slideToggle(false)}
                                >
                                  {opened && (
                                    <SelectWareHouse
                                      cacheKey="shipmentTimelineSectionSelectWarehouseQuery"
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
                        ) : (
                          <ShipmentWarehouseCard warehouse={warehouse} readOnly />
                        )}
                        <Tooltip
                          message={
                            <FormattedMessage
                              id="components.Shipments.warehouseTimelineTooltip"
                              defaultMessage="The warehouse information here is only available for Shipments that have no Containers. If a Container is added to this Shipment, all current warehouse information here will be removed."
                            />
                          }
                        >
                          <div className={WarehouseArrivalInfoIconStyle}>
                            <Icon icon="INFO" />
                          </div>
                        </Tooltip>
                      </>
                    }
                  />
                )}
                <TimelineInfoSection
                  id="deliveryReady"
                  groupIds={[
                    getByPath('importer.id', shipment),
                    getByPath('exporter.id', shipment),
                  ].filter(Boolean)}
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
    </>
  );
};
export default TimelineSection;
