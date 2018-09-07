// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { pickByProps } from 'utils/fp';
import { SectionHeader, SectionWrapper } from 'components/Form';
import OrderFormContainer from './container';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import StatusButton from './components/StatusButton';
import OrderFormWrapperStyle from './style';

type Props = {
  order: Object,
  onChangeStatus: Function,
};

const itemSectionFields = pickByProps(['exporter', 'orderItems']);

export default function OrderForm({ order, onChangeStatus }: Props) {
  const isNew = Object.keys(order).length === 0;

  return (
    <div className={OrderFormWrapperStyle}>
      <SectionWrapper id="orderSection">
        {!isNew && <StatusButton order={order} onChangeStatus={onChangeStatus} />}

        <OrderSection isNew={isNew} />
      </SectionWrapper>

      <SectionWrapper id="itemsSection">
        <Subscribe to={[OrderFormContainer]}>
          {({ state: values, setFieldValue }) => (
            <>
              <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${values.orderItems.length})`} />
              <ItemsSection
                initialValues={{ ...itemSectionFields(values) }}
                isNew={isNew}
                onSelectItems={orderItems =>
                  setFieldValue('orderItems', [...values.orderItems, ...orderItems])
                }
              />
            </>
          )}
        </Subscribe>
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
