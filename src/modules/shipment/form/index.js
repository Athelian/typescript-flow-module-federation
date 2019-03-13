// @flow
import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { isEquals } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { ShipmentBatchesContainer } from './containers';
import { ShipmentSection } from './components';
import { ShipmentFormWrapperStyle } from './style';

const AsyncCargoSection = lazy(() => import('./components/CargoSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));
const AsyncTimelineSection = lazy(() => import('./components/TimelineSection'));
const AsyncTaskSection = lazy(() => import('./components/TaskSection'));

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
      scrollIntoView({ targetId: anchor });
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const { shipment, isOwner } = this.props;

    return !isEquals(shipment, nextProps.shipment) || isOwner !== nextProps.isOwner;
  }

  render() {
    const { isNew } = this.props;
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
          <AsyncTaskSection type="Shipment" />
          <AsyncOrdersSection />
        </div>
      </Suspense>
    );
  }
}

export default ShipmentForm;
