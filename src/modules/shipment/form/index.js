// @flow
import React, { lazy, Suspense } from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { isEquals } from 'utils/fp';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import { isEnableBetaFeature } from 'utils/env';
import scrollIntoView from 'utils/scrollIntoView';
import { SectionWrapper, SectionHeader, LastModified, StatusToggle } from 'components/Form';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';
import { uniqueOrders } from 'modules/container/utils';
import { ShipmentBatchesContainer } from './containers';
import { ShipmentSection } from './components';
import { ShipmentFormWrapperStyle } from './style';

const AsyncCargoSection = lazy(() => import('./components/CargoSection'));
const AsyncContainerCargoSection = lazy(() => import('./components/ContainerCargoSection'));
const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));
const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));
const AsyncTimelineSection = lazy(() => import('./components/TimelineSection'));

type OptionalProps = {
  isNew: boolean,
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
    const { shipment } = this.props;

    return !isEquals(shipment, nextProps.shipment);
  }

  onClone = () => {
    const { shipment } = this.props;
    navigate(`/shipment/clone/${encodeId(shipment.id)}`);
  };

  render() {
    const { isNew, isClone, shipment } = this.props;
    const { updatedAt, updatedBy, archived } = shipment;
    return (
      <Suspense fallback={<LoadingIcon />}>
        <div className={ShipmentFormWrapperStyle}>
          <SectionWrapper id="shipment_shipmentSection">
            <SectionHeader
              icon="SHIPMENT"
              title={<FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />}
            >
              {!isNew && (
                <>
                  <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                  {!isClone && <CloneButton onClick={this.onClone} />}
                  <BooleanValue>
                    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                      <StatusToggle
                        archived={archived}
                        openStatusDialog={() => dialogToggle(true)}
                        activateDialog={
                          <ShipmentActivateDialog
                            shipment={shipment}
                            isOpen={statusDialogIsOpen && !!archived}
                            onRequestClose={() => dialogToggle(false)}
                            onConfirm={() => window.location.reload()}
                          />
                        }
                        archiveDialog={
                          <ShipmentArchiveDialog
                            shipment={shipment}
                            isOpen={statusDialogIsOpen && !archived}
                            onRequestClose={() => dialogToggle(false)}
                            onConfirm={() => window.location.reload()}
                          />
                        }
                      />
                    )}
                  </BooleanValue>
                </>
              )}
            </SectionHeader>
            <ShipmentSection isNew={isNew} />
          </SectionWrapper>
          <SectionWrapper id="shipment_timelineSection">
            <SectionHeader
              icon="TIMELINE"
              title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
            />
            <AsyncTimelineSection isNew={isNew} />
          </SectionWrapper>
          <SectionWrapper id="shipment_cargoSection">
            {isEnableBetaFeature ? (
              <>
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
                <AsyncContainerCargoSection />
              </>
            ) : (
              <>
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
              </>
            )}
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
          <SectionWrapper id="shipment_orderSection">
            <Subscribe to={[ShipmentBatchesContainer]}>
              {({ state: { batches } }) => {
                const orders = uniqueOrders(batches);
                return (
                  <>
                    <SectionHeader
                      icon="ORDER"
                      title={
                        <>
                          <FormattedMessage id="modules.Shipments.order" defaultMessage="ORDERS" />(
                          {orders.length})
                        </>
                      }
                    />
                    <AsyncOrdersSection orders={orders} />
                  </>
                );
              }}
            </Subscribe>
          </SectionWrapper>
        </div>
      </Suspense>
    );
  }
}

export default ShipmentForm;
