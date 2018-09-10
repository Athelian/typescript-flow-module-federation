// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { isEquals } from 'utils/fp';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import StatusButton from './components/StatusButton';
import OrderFormWrapperStyle from './style';
import { OrderItemsContainer } from './containers';

type OptionalProps = {
  isNew: boolean,
  order: Object,
};

type Props = OptionalProps & {
  onSave: (Object, Function) => void,
};

const defaultProps = {
  isNew: false,
  order: {},
};

export default class OrderForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { order } = this.props;
    if (!isEquals(order, nextProps.order)) return true;

    return false;
  }

  render() {
    const { isNew, order, onSave } = this.props;
    return (
      <div className={OrderFormWrapperStyle}>
        <SectionWrapper id="orderSection">
          {!isNew && (
            <StatusButton
              order={order}
              onChangeStatus={archived =>
                onSave({ archived }, () => {
                  window.location.reload();
                })
              }
            />
          )}

          <OrderSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="itemsSection">
          <Subscribe to={[OrderItemsContainer]}>
            {({ state: values }) => (
              <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${values.orderItems.length})`} />
            )}
          </Subscribe>
          <ItemsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="documentsSection">
          <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
          <DocumentsSection initialValues={{ files: order.files }} />
        </SectionWrapper>

        <SectionWrapper id="shipmentsSection">
          <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
          <ShipmentsSection />
        </SectionWrapper>
      </div>
    );
  }
}
