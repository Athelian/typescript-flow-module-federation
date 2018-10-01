// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import Loadable from 'react-loadable';
import { BooleanValue } from 'react-values';
import LoadingIcon from 'components/LoadingIcon';
import { isEquals } from 'utils/fp';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import OrderActivateDialog from './components/OrderActivateDialog';
import OrderArchiveDialog from './components/OrderArchiveDialog';
import OrderSection from './components/OrderSection';
import OrderFormWrapperStyle from './style';
import { OrderItemsContainer, OrderInfoContainer, OrderFilesContainer } from './containers';

const AsyncItemsSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/ItemsSection'),
});
const AsyncDocumentsSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/DocumentsSection'),
});
const AsyncShipmentsSection = Loadable({
  loading: LoadingIcon,
  loader: () => import('./components/ShipmentsSection'),
});

type OptionalProps = {
  isNew: boolean,
  order: Object,
  onDetailReady: () => void,
  onChangeStatus: (Object, Function) => Promise<any>,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  order: {},
  onDetailReady: () => {},
  onChangeStatus: () => Promise.resolve({}),
};

export default class OrderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { order } = this.props;

    return !isEquals(order, nextProps.order);
  }

  getBatchesSummary = () => {
    const { order } = this.props;

    let totalBatches = 0;
    let shippedBatches = 0;

    if (order.orderItems) {
      order.orderItems.forEach(item => {
        if (item.batches) {
          totalBatches += item.batches.length;
          item.batches.forEach(batch => {
            if (batch.shipment) {
              shippedBatches += 1;
            }
          });
        }
      });
    }

    return { totalBatches, shippedBatches, unshippedBatches: totalBatches - shippedBatches };
  };

  render() {
    const { isNew, order, onChangeStatus } = this.props;

    const { totalBatches, unshippedBatches, shippedBatches } = this.getBatchesSummary();

    return (
      <div className={OrderFormWrapperStyle}>
        <SectionWrapper id="orderSection">
          <SectionHeader icon="ORDER" title="ORDER">
            {!isNew && (
              <>
                <LastModified updatedAt={order.updatedAt} updatedBy={order.updatedBy} />
                <BooleanValue>
                  {({ value: statusDialogIsOpen, set: dialogToggle }) => (
                    <StatusToggle
                      archived={order.archived}
                      openStatusDialog={() => dialogToggle(true)}
                      activateDialog={
                        <OrderActivateDialog
                          isOpen={statusDialogIsOpen && !!order.archived}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                          onConfirm={() => {
                            dialogToggle(false);
                            onChangeStatus({ archived: false }, () => window.location.reload());
                          }}
                          totalBatches={totalBatches}
                          unshippedBatches={unshippedBatches}
                          shippedBatches={shippedBatches}
                        />
                      }
                      archiveDialog={
                        <OrderArchiveDialog
                          isOpen={statusDialogIsOpen && !order.archived}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                          onConfirm={() => {
                            dialogToggle(false);
                            onChangeStatus({ archived: false }, () => window.location.reload());
                          }}
                          totalBatches={totalBatches}
                          unshippedBatches={unshippedBatches}
                          shippedBatches={shippedBatches}
                        />
                      }
                    />
                  )}
                </BooleanValue>
              </>
            )}
          </SectionHeader>
          <OrderSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="itemsSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: values }) => (
              <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${values.orderItems.length})`} />
            )}
          </Subscribe>
          <AsyncItemsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="documentsSection">
          <Subscribe to={[OrderFilesContainer]}>
            {({ state: values }) => (
              <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${values.files.length})`} />
            )}
          </Subscribe>
          <AsyncDocumentsSection />
        </SectionWrapper>

        <SectionWrapper id="shipmentsSection">
          <Subscribe to={[OrderInfoContainer]}>
            {({ state: { shipments } }) => (
              <>
                <SectionHeader icon="SHIPMENT" title={`SHIPMENT (${shipments.length})`} />
                <AsyncShipmentsSection shipments={shipments} />
              </>
            )}
          </Subscribe>
        </SectionWrapper>
      </div>
    );
  }
}
