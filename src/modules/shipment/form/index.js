// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { getByPath, isEquals } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import AutoDateBinding from 'modules/task/common/AutoDateBinding';
import FormattedNumber from 'components/FormattedNumber';
import { SectionWrapper, SectionHeader } from 'components/Form';
import {
  ShipmentBatchesContainer,
  ShipmentTasksContainer,
  ShipmentInfoContainer,
  ShipmentTimelineContainer,
  ShipmentFilesContainer,
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
  anchor: string,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
  isOwner: true,
  anchor: '',
};

class ShipmentForm extends React.Component<Props> {
  static defaultProps = defaultProps;

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
    const { shipment } = this.props;

    return !isEquals(shipment, nextProps.shipment);
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
                      <FormattedMessage id="modules.Shipments.cargo" defaultMessage="CARGO " />
                      {' ('}
                      <FormattedNumber value={batches.length} />
                      {')'}
                    </>
                  }
                />
              )}
            </Subscribe>
            <AsyncCargoSection shipmentIsArchived={shipment.archived} />
          </SectionWrapper>

          <SectionWrapper id="shipment_documentsSection">
            <Subscribe to={[ShipmentFilesContainer]}>
              {({ state: { files } }) => (
                <SectionHeader
                  icon="DOCUMENT"
                  title={
                    <>
                      <FormattedMessage
                        id="modules.Shipments.documents"
                        defaultMessage="DOCUMENTS"
                      />
                      {' ('}
                      <FormattedNumber value={files.length} />
                      {')'}
                    </>
                  }
                />
              )}
            </Subscribe>
            <AsyncDocumentsSection />
          </SectionWrapper>
          <Subscribe to={[ShipmentInfoContainer]}>
            {({ state: info }) => (
              <AsyncTaskSection
                groupIds={[getByPath('importer.id', info), getByPath('exporter.id', info)].filter(
                  Boolean
                )}
                entityId={shipment.id}
                type="shipment"
              />
            )}
          </Subscribe>

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
