// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Loadable from 'react-loadable';
import { uniqBy } from 'lodash';
import { isEquals } from 'utils/fp';
import { Subscribe } from 'unstated';
import LoadingIcon from 'components/LoadingIcon';
import { SectionWrapper, SectionHeader, LastModified } from 'components/Form';
import { ShipmentBatchesContainer } from './containers';
import ShipmentSection from './components/ShipmentSection';
import { ShipmentFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  onDetailReady: () => void,
};

type Props = OptionalProps & {
  shipment: Object,
};

const defaultProps = {
  isNew: false,
  onDetailReady: () => {},
};

const AsyncTimelineSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/TimelineSection'),
});
const AsyncCargoSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/CargoSection'),
});
const AsyncOrdersSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/OrdersSection'),
});
const AsyncDocumentsSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/DocumentsSection'),
});

class ShipmentForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { shipment } = this.props;

    return !isEquals(shipment, nextProps.shipment);
  }

  render() {
    const { isNew, shipment } = this.props;

    return (
      <div className={ShipmentFormWrapperStyle}>
        <SectionWrapper id="shipmentSection">
          <SectionHeader
            icon="SHIPMENT"
            title={<FormattedMessage id="modules.shipment.shipment" defaultMessage="SHIPMENT" />}
          >
            {!isNew && (
              <LastModified updatedAt={shipment.updatedAt} updatedBy={shipment.updatedBy} />
            )}
          </SectionHeader>
          <ShipmentSection isNew={isNew} />
        </SectionWrapper>
        <SectionWrapper id="timelineSection">
          <SectionHeader
            icon="TIMELINE"
            title={<FormattedMessage id="modules.shipment.timeline" defaultMessage="TIMELINE" />}
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
                    <FormattedMessage id="modules.shipment.shipment" defaultMessage="CARGO" />(
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
            title={<FormattedMessage id="modules.shipment.document" defaultMessage="DOCUMENTS" />}
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
                        <FormattedMessage id="modules.shipment.order" defaultMessage="ORDERS" />(
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
    );
  }
}

export default ShipmentForm;
