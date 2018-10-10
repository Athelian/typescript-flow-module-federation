// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import Loadable from 'react-loadable';
import { BooleanValue } from 'react-values';
import LoadingIcon from 'components/LoadingIcon';
import { isEquals } from 'utils/fp';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import OrderSection from './components/OrderSection';
import OrderFormWrapperStyle from './style';
import { OrderItemsContainer, OrderInfoContainer, OrderFilesContainer } from './containers';

const AsyncItemsSection = Loadable({
  loading: () => <LoadingIcon />,
  loader: () => import('./components/ItemsSection'),
});
const AsyncDocumentsSection = Loadable({
  loading: () => <LoadingIcon />,
  loader: () => import('./components/DocumentsSection'),
});
const AsyncShipmentsSection = Loadable({
  loading: () => <LoadingIcon />,
  loader: () => import('./components/ShipmentsSection'),
});

type OptionalProps = {
  isNew: boolean,
  order: Object,
  onFormReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  order: {},
  onFormReady: () => {},
  onChangeStatus: () => Promise.resolve({}),
};

export default class OrderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { order } = this.props;

    return !isEquals(order, nextProps.order);
  }

  render() {
    const { isNew, order } = this.props;
    const { updatedAt, updatedBy, archived } = order;
    return (
      <div className={OrderFormWrapperStyle}>
        <SectionWrapper id="orderSection">
          <SectionHeader
            icon="ORDER"
            title={<FormattedMessage id="modules.order.order" defaultMessage="ORDER" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={updatedAt} updatedBy={updatedBy} />
                <BooleanValue>
                  {({ value: isDialogOpen, set: dialogToggle }) => (
                    <StatusToggle
                      archived={archived}
                      openStatusDialog={() => dialogToggle(true)}
                      activateDialog={
                        <OrderActivateDialog
                          order={order}
                          isOpen={isDialogOpen && !!archived}
                          onRequestClose={() => dialogToggle(false)}
                          onConfirm={() => window.location.reload()}
                        />
                      }
                      archiveDialog={
                        <OrderArchiveDialog
                          order={order}
                          isOpen={isDialogOpen && !archived}
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

          <OrderSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="itemsSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: values }) => (
              <SectionHeader
                icon="ORDER_ITEM"
                title={
                  <>
                    <FormattedMessage id="modules.order.items" defaultMessage="ITEMS" /> (
                    {values.orderItems.length})
                  </>
                }
              />
            )}
          </Subscribe>
          <AsyncItemsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="documentsSection">
          <Subscribe to={[OrderFilesContainer]}>
            {({ state: values }) => (
              <SectionHeader
                icon="DOCUMENT"
                title={
                  <>
                    <FormattedMessage id="modules.order.documents" defaultMessage="DOCUMENTS" /> (
                    {values.files.length})
                  </>
                }
              />
            )}
          </Subscribe>
          <AsyncDocumentsSection />
        </SectionWrapper>

        <SectionWrapper id="shipmentsSection">
          <Subscribe to={[OrderInfoContainer]}>
            {({ state: { shipments } }) => (
              <>
                <SectionHeader
                  icon="SHIPMENT"
                  title={
                    <>
                      <FormattedMessage id="modules.order.shipments" defaultMessage="SHIPMENTS" /> (
                      {shipments.length})
                    </>
                  }
                />
                <AsyncShipmentsSection shipments={shipments} />
              </>
            )}
          </Subscribe>
        </SectionWrapper>
      </div>
    );
  }
}
