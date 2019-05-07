// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { isEquals } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import { SectionWrapper, SectionHeader } from 'components/Form';
import {
  ShipmentBatchesContainer,
  ShipmentTasksContainer,
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
} from './containers';
import { ShipmentSection } from './components';
import { ShipmentFormWrapperStyle } from './style';

const AsyncCargoSection = lazy(() => import('./components/CargoSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));
const AsyncTimelineSection = lazy(() => import('./components/TimelineSection'));
const AsyncTaskSection = lazy(() => import('modules/task/common/TaskSection'));

type OptionalProps = {
  isNew: boolean,
  isOwner: boolean,
  isClone: boolean,
  onFormReady: () => void,
  anchor: string,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
  isOwner: true,
  onFormReady: () => {},
  anchor: '',
};

class ShipmentForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady, anchor } = this.props;

    if (onFormReady) onFormReady();

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

    return !isEquals(shipment, nextProps.shipment) || isOwner !== nextProps.isOwner;
  }

  render() {
    const { isNew, shipment } = this.props;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={ShipmentFormWrapperStyle}>
          <ShipmentSection {...this.props} />

          <SectionWrapper id="shipment_timelineSection">
            <SectionHeader
              icon="TIMELINE"
              title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
            />
            <AsyncTimelineSection isNew={isNew} />
          </SectionWrapper>
          <SectionWrapper id="shipment_cargoSection">
            <Subscribe to={[ShipmentBatchesContainer]}>
              {({ state: { batches } }) => (
                <SectionHeader
                  icon="CARGO"
                  title={
                    <>
                      <FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO " />(
                      {batches.length})
                    </>
                  }
                />
              )}
            </Subscribe>
            <AsyncCargoSection />
          </SectionWrapper>
          <SectionWrapper id="shipment_documentsSection">
            <SectionHeader
              icon="DOCUMENT"
              title={
                <FormattedMessage id="modules.Shipments.document" defaultMessage="DOCUMENTS" />
              }
            />
            <AsyncDocumentsSection />
          </SectionWrapper>
          <AsyncTaskSection entityId={shipment.id} type="shipment" />
          <AsyncOrdersSection />
          <Subscribe
            to={[ShipmentTasksContainer, ShipmentInfoContainer, ShipmentTimelineContainer]}
          >
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
                type="shipment"
                values={{ ...info, ...timeline }}
                tasks={tasks}
                setTaskValue={setFieldValue}
              />
            )}
          </Subscribe>
        </div>
      </Suspense>
    );
  }
}

export default ShipmentForm;
