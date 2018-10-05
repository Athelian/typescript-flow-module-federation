// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import Loadable from 'react-loadable';
import { BooleanValue } from 'react-values';
import LoadingIcon from 'components/LoadingIcon';
import { isEquals } from 'utils/fp';
import { SectionHeader, SectionWrapper, LastModified, StatusToggle } from 'components/Form';
import OrderActivateDialog from 'modules/order/common/OrderActivateDialog';
import OrderArchiveDialog from 'modules/order/common/OrderArchiveDialog';
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
  onDetailReady: () => void,
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

  render() {
    const { isNew, order } = this.props;

    return (
      <div className={OrderFormWrapperStyle}>
        <SectionWrapper id="orderSection">
          <SectionHeader
            icon="ORDER"
            title={<FormattedMessage id="modules.order.order" defaultMessage="ORDER" />}
          >
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
                          order={order}
                          isOpen={statusDialogIsOpen && !!order.archived}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                        />
                      }
                      archiveDialog={
                        <OrderArchiveDialog
                          order={order}
                          isOpen={statusDialogIsOpen && !order.archived}
                          onRequestClose={() => dialogToggle(false)}
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
