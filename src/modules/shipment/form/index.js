// @flow
import * as React from 'react';
import { Waypoint } from 'react-waypoint';
import { useMutation } from '@apollo/react-hooks';
import { Subscribe } from 'unstated';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import useUser from 'hooks/useUser';
import scrollIntoView from 'utils/scrollIntoView';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { SectionWrapper } from 'components/Form';
import { fileMarkAsReadMutation } from './mutation';
import {
  ShipmentTasksContainer,
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from './containers';
import {
  ShipmentSection,
  DocumentsSection,
  OrdersSection,
  TimelineAndCargoSections,
  ShipmentTasksSection,
  CleanUpShipment,
} from './components';
import { ShipmentFormWrapperStyle } from './style';

type Props = {|
  shipment: Object,
  loading: boolean,
  isNew?: boolean,
  isClone?: boolean,
  anchor?: string,
  skipToSection?: ?string, // only documents for now
  initDataForSlideView?: Object,
|};

const ShipmentForm = ({
  isNew,
  isClone,
  shipment,
  loading,
  initDataForSlideView,
  skipToSection,
  anchor,
}: Props) => {
  const { organization } = useUser();

  const [fileMarkAsRead] = useMutation(fileMarkAsReadMutation);

  React.useEffect(() => {
    if (skipToSection === 'documents') {
      // wait for the element is rendering on DOM
      const sectionId = 'shipment_documentsSection';

      const retryFindElement = () => {
        const foundElement = document.querySelector(`#${sectionId}`);

        if (!foundElement) {
          requestAnimationFrame(retryFindElement);
        } else {
          // scroll to element after rendering
          setTimeout(() => scrollIntoView({ targetId: sectionId }), 350);
        }
      };
      requestAnimationFrame(retryFindElement);
    }
  }, [skipToSection]);

  React.useEffect(() => {
    if (anchor) {
      // wait for the element is rendering on DOM
      const sectionId = 'shipment_timelineSection';
      const retryFindElement = () => {
        const foundElement = document.querySelector(`#${sectionId}`);
        if (!foundElement) {
          requestAnimationFrame(retryFindElement);
        } else {
          // scroll to element after rendering
          scrollIntoView({ targetId: sectionId });

          // set to 350 because slideview animation is 300ms
          setTimeout(() => scrollIntoView({ targetId: anchor, boundaryId: sectionId }), 350);
        }
      };
      requestAnimationFrame(retryFindElement);
    }
  }, [anchor]);

  return (
    <div className={ShipmentFormWrapperStyle}>
      <SectionWrapper id="shipment_shipmentSection">
        <ShipmentSection
          shipment={shipment}
          isLoading={loading}
          isNew={Boolean(isNew)}
          isClone={Boolean(isClone)}
          initDataForSlideView={initDataForSlideView}
        />
      </SectionWrapper>
      <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer]}>
        {(taskContainer, infoContainer) => (
          <TimelineAndCargoSections
            exporterId={getByPath('exporter.id', infoContainer.state)}
            importerId={getByPathWithDefault('', 'importer.id', infoContainer.state)}
            shipmentIsArchived={shipment.archived}
            isTaskReadyForBinding={taskContainer.state.hasCalledTasksApiYet}
            isNew={Boolean(isNew)}
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
        )}
      </Subscribe>
      <SectionWrapper id="shipment_documentsSection">
        <div>
          <DocumentsSection
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
          {// This will fire the mutation when scrolled to
          !isNew && !isClone && (
            <Waypoint
              onEnter={({ event }) => {
                if (event) {
                  fileMarkAsRead({
                    variables: {
                      entity: {
                        shipmentId: shipment.id,
                      },
                    },
                  });
                }
              }}
            />
          )}
        </div>
      </SectionWrapper>
      <SectionWrapper id="shipment_taskSection">
        <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer]}>
          {({ initDetailValues }, { state: { importer, exporter } }) => (
            <ShipmentTasksSection
              groupIds={[getByPath('id', importer), getByPath('id', exporter)].filter(Boolean)}
              initValues={initDetailValues}
              isLoading={loading}
              entityId={!isClone && shipment.id ? shipment.id : ''}
              entityOwnerId={!isClone && shipment.id ? shipment?.ownedBy?.id : organization.id}
            />
          )}
        </Subscribe>
      </SectionWrapper>

      <Subscribe to={[ShipmentBatchesContainer]}>
        {({ state: { batches, hasCalledBatchesApiYet } }) => (
          <OrdersSection isReady={hasCalledBatchesApiYet || isNew || isClone} batches={batches} />
        )}
      </Subscribe>

      <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer, ShipmentTimelineContainer]}>
        {(
          {
            state: {
              todo: { tasks },
            },
            setFieldValue,
          },
          { state: info },
          { state: timeline }
        ) => (
          <AutoDateBinding
            type="Shipment"
            values={{ ...info, ...timeline }}
            tasks={tasks}
            setTaskValue={setFieldValue}
          />
        )}
      </Subscribe>

      <Subscribe to={[ShipmentBatchesContainer, ShipmentContainersContainer]}>
        {(batchesContainer, containersContainer) => (
          <CleanUpShipment
            isNew={isNew || !!isClone}
            shipmentId={shipment?.id}
            containersContainer={containersContainer}
            batchesContainer={batchesContainer}
          />
        )}
      </Subscribe>
    </div>
  );
};

export default ShipmentForm;
