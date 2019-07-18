// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { getByPath, isEquals, getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { SectionWrapper } from 'components/Form';
import {
  ShipmentTasksContainer,
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
} from './containers';
import {
  ShipmentSection,
  DocumentsSection,
  OrdersSection,
  TimelineAndCargoSections,
  ShipmentTasksSection,
} from './components';
import { ShipmentFormWrapperStyle } from './style';

type Props = {|
  shipment: Object,
  loading: boolean,
  isNew?: boolean,
  isClone?: boolean,
  isOwner?: boolean,
  anchor?: string,
  initDataForSlideView?: Object,
|};

class ShipmentForm extends React.Component<Props> {
  componentDidMount() {
    const { anchor } = this.props;

    if (anchor) {
      // wait for the element is rendering on DOM
      const targetId = 'timelineInfoSection';
      const retryFindElement = () => {
        const foundElement = document.querySelector(`#${targetId}`);
        if (!foundElement) {
          requestAnimationFrame(retryFindElement);
        } else {
          // scroll to element after rendering
          setTimeout(() => scrollIntoView({ targetId: anchor }), 200);
        }
      };
      requestAnimationFrame(retryFindElement);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const { shipment, isOwner } = this.props;
    return !isEquals(shipment, nextProps.shipment) || nextProps.isOwner !== isOwner;
  }

  render() {
    const { isNew, isClone, shipment, loading, initDataForSlideView } = this.props;
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
          {({ state: { hasCalledTasksApiYet }, shipmentInfo }) => (
            <TimelineAndCargoSections
              exporterId={getByPath('exporter.id', shipmentInfo)}
              importerId={getByPathWithDefault('', 'importer.id', shipmentInfo)}
              shipmentIsArchived={shipment.archived}
              isTaskReadyForBinding={hasCalledTasksApiYet}
              isNew={Boolean(isNew)}
              entityId={!isClone && shipment.id ? shipment.id : ''}
              isLoading={loading}
            />
          )}
        </Subscribe>

        <SectionWrapper id="shipment_documentsSection">
          <DocumentsSection
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
        </SectionWrapper>
        <SectionWrapper id="shipment_taskSection">
          <Subscribe to={[ShipmentTasksContainer, ShipmentInfoContainer]}>
            {({ initDetailValues }, { state: { importer, exporter } }) => (
              <ShipmentTasksSection
                groupIds={[getByPath('id', importer), getByPath('id', exporter)].filter(Boolean)}
                initValues={initDetailValues}
                isLoading={loading}
                entityId={!isClone && shipment.id ? shipment.id : ''}
              />
            )}
          </Subscribe>
        </SectionWrapper>

        <SectionWrapper id="shipment_orderSection">
          <OrdersSection
            entityId={!isClone && shipment.id ? shipment.id : ''}
            isLoading={loading}
          />
        </SectionWrapper>
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
      </div>
    );
  }
}

export default ShipmentForm;
