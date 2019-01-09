// @flow
import * as React from 'react';
import { createObjectValue } from 'react-values';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import BatchForm from 'modules/batch/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import ProductForm from 'modules/product/index.form';
import { encodeId } from 'utils/id';

export const ToggleSlide = createObjectValue({ id: null, type: null, show: false });

type SlideViewWrapperProps = {
  children: React.Node,
  reset: Function,
};
class SlideViewWrapper extends React.Component<SlideViewWrapperProps> {
  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

const SlideForm = () => (
  <ToggleSlide>
    {({ value: { show, id, type, onSuccess }, set, reset }) => {
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
        case 'NEW_ORDER': {
          form = (
            <OrderForm
              path="new"
              isSlideView
              onSuccessCallback={onSuccess}
              redirectAfterSuccess={false}
              onCancel={reset}
            />
          );
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
        case 'NEW_SHIPMENT': {
          form = (
            <ShipmentForm
              path="new"
              isSlideView
              onSuccessCallback={onSuccess}
              redirectAfterSuccess={false}
              onCancel={reset}
            />
          );
          break;
        }
        case 'PRODUCT': {
          form = <ProductForm productId={encodeId(id)} isSlideView />;
          break;
        }
      }
      return (
        <SlideViewWrapper reset={reset}>
          <SlideView
            isOpen={show}
            onRequestClose={() => set('show', false)}
            options={{ width: '1030px' }}
          >
            {form}
          </SlideView>
        </SlideViewWrapper>
      );
    }}
  </ToggleSlide>
);

export default SlideForm;
