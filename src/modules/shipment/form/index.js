// @flow

import React, { lazy, Suspense } from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { uniqBy } from 'lodash';
import { isEquals } from 'utils/fp';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import scrollIntoView from 'utils/scrollIntoView';
import { SectionWrapper, SectionHeader, LastModified, StatusToggle } from 'components/Form';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';
import { ShipmentBatchesContainer } from './containers';
import ShipmentSection from './components/ShipmentSection';
import { ShipmentFormWrapperStyle } from './style';

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

const AsyncTimelineSection = lazy(() => import('./components/TimelineSection'));

const AsyncCargoSection = lazy(() => import('./components/CargoSection'));

const AsyncOrdersSection = lazy(() => import('./components/OrdersSection'));

const AsyncDocumentsSection = lazy(() => import('./components/DocumentsSection'));

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

  componentDidUpdate() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
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
          <SectionWrapper id="shipmentSection">
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
          <SectionWrapper id="timelineSection">
            <SectionHeader
              icon="TIMELINE"
              title={<FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />}
            />
            <AsyncTimelineSection isNew={isNew} />
          </SectionWrapper>
          <SectionWrapper id="cargoSection">
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
          <SectionWrapper id="documentsSection">
            <SectionHeader
              icon="DOCUMENT"
              title={
                <FormattedMessage id="modules.Shipments.document" defaultMessage="DOCUMENTS" />
              }
            />
            <AsyncDocumentsSection />
          </SectionWrapper>
          <SectionWrapper id="orderSection">
            <Subscribe to={[ShipmentBatchesContainer]}>
              {({ state: { batches } }) => {
                const uniqueOrders = uniqBy(batches.map(batch => batch.orderItem.order), 'id');
                return (
                  <>
                    <SectionHeader
                      icon="ORDER"
                      title={
                        <>
                          <FormattedMessage id="modules.Shipments.order" defaultMessage="ORDERS" />(
                          {uniqueOrders.length})
                        </>
                      }
                    />
                    <AsyncOrdersSection orders={uniqueOrders} />
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
