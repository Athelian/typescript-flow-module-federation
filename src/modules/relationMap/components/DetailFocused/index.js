import React from 'react';
import { createObjectValue } from 'react-values';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import BatchForm from 'modules/batch/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import ProductForm from 'modules/product/index.form';
import { encodeId } from 'utils/id';

export const ToggleSlide = createObjectValue({ id: null, type: null, show: false });

const DetailFocused = () => (
  <ToggleSlide>
    {({ value: { show, id, type }, set }) => {
      let form = null;
      switch (type) {
        default: {
          form = null;
          break;
        }
        case 'ORDER': {
          form = <OrderForm orderId={encodeId(id)} isSlideView />;
          break;
        }
        case 'BATCH': {
          form = <BatchForm batchId={encodeId(id)} isSlideView />;
          break;
        }
        case 'SHIPMENT': {
          form = <ShipmentForm shipmentId={encodeId(id)} isSlideView />;
          break;
        }
        case 'PRODUCT': {
          form = <ProductForm productId={encodeId(id)} isSlideView />;
          break;
        }
      }
      return (
        <SlideView
          isOpen={show}
          onRequestClose={() => set('show', false)}
          options={{ width: '1030px' }}
        >
          {form}
        </SlideView>
      );
    }}
  </ToggleSlide>
);

export default DetailFocused;
