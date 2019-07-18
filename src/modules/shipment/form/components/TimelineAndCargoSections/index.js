// @flow

import * as React from 'react';
import { Subscribe } from 'unstated';
import { getByPathWithDefault } from 'utils/fp';
import {
  ShipmentTimelineContainer,
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import { SectionWrapper } from 'components/Form';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import TimelineSection from '../TimelineSection';
import CargoSection from '../CargoSection';
import { shipmentFormTimelineAndCargoQuery } from './query';
import { PlaceHolderWrapperStyle } from './style';

type Props = {|
  isNew: boolean,
  entityId: string,
  isLoading: boolean,
  isTaskReadyForBinding: boolean,
  shipmentIsArchived: boolean,
  importerId: string,
  exporterId: string,
|};

const CustomPlaceHolder = () => {
  return (
    <>
      <SectionWrapper id="shipment_timelineSection">
        <ListCardPlaceHolder />
      </SectionWrapper>
      <SectionWrapper id="shipment_cargoSection">
        <ListCardPlaceHolder />
      </SectionWrapper>
    </>
  );
};

const TimelineAndCargoSections = (props: Props) => {
  const {
    entityId,
    isLoading,
    isNew,
    isTaskReadyForBinding,
    shipmentIsArchived,
    importerId,
    exporterId,
  } = props;
  return (
    <Subscribe
      to={[ShipmentTimelineContainer, ShipmentBatchesContainer, ShipmentContainersContainer]}
    >
      {(timelineContainer, batchesContainer, containersContainer) => (
        <QueryPlaceHolder
          className={PlaceHolderWrapperStyle}
          PlaceHolder={CustomPlaceHolder}
          query={shipmentFormTimelineAndCargoQuery}
          entityId={entityId}
          isLoading={isLoading}
          onCompleted={result => {
            const cargoReady = getByPathWithDefault({}, 'shipment.cargoReady', result);
            const voyages = getByPathWithDefault([], 'shipment.voyages', result);
            const containerGroups = getByPathWithDefault([{}], 'shipment.containerGroups', result);
            timelineContainer.initDetailValues(
              {
                cargoReady,
                voyages,
                containerGroups,
              },
              true
            );

            const batches = getByPathWithDefault([], 'shipment.batches', result);
            batchesContainer.initDetailValues(batches, true);
            const containers = getByPathWithDefault([], 'shipment.containers', result);
            containersContainer.initDetailValues(containers, true);
          }}
        >
          {() => {
            return (
              <>
                <SectionWrapper id="shipment_timelineSection">
                  <TimelineSection isNew={isNew} isTaskReadyForBinding={isTaskReadyForBinding} />
                </SectionWrapper>
                <SectionWrapper id="shipment_cargoSection">
                  <CargoSection
                    shipmentIsArchived={shipmentIsArchived}
                    importerId={importerId}
                    exporterId={exporterId}
                  />
                </SectionWrapper>
              </>
            );
          }}
        </QueryPlaceHolder>
      )}
    </Subscribe>
  );
};
export default TimelineAndCargoSections;
