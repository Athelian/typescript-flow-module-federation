// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import ItemForm from 'modules/orderItem/index.form';
import BatchForm from 'modules/batch/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMapV2/constants';
import { encodeId } from 'utils/id';

type Props = {|
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof SHIPMENT,
  selectedId: string,
  onClose: () => void,
|};

const EditFormSlideView = ({ type, selectedId: id, onClose }: Props) => {
  let form = null;
  switch (type) {
    case ORDER: {
      form = <OrderForm orderId={encodeId(id)} isSlideView />;
      break;
    }
    case ORDER_ITEM: {
      form = <ItemForm orderItemId={encodeId(id)} isSlideView />;
      break;
    }
    case BATCH: {
      form = <BatchForm batchId={encodeId(id)} isSlideView />;
      break;
    }
    case SHIPMENT: {
      form = <ShipmentForm shipmentId={encodeId(id)} isSlideView />;
      break;
    }
    default: {
      form = null;
      break;
    }
  }
  return (
    <SlideView isOpen={id !== ''} onRequestClose={onClose}>
      {form}
    </SlideView>
  );
};

export default EditFormSlideView;
