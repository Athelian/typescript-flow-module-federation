// @flow
import * as React from 'react';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import BatchForm from 'modules/batch/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
import { encodeId } from 'utils/id';

type Props = {
  type: string,
  selectedId: string,
  onClose: () => void,
};

const EditForm = ({ type, selectedId: id, onClose }: Props) => {
  let form = null;
  const context = React.useContext(ActionDispatch);
  const { dispatch } = context;
  const actions = actionCreators(dispatch);
  switch (type) {
    default: {
      form = null;
      break;
    }
    case 'NEW_ORDER': {
      form = (
        <OrderForm
          path="new"
          isSlideView
          redirectAfterSuccess={false}
          onSuccessCallback={data => {
            if (data.orderCreate.id) {
              actions.refetchQueryBy('ORDER', data.orderCreate.id);
              actions.adddNewOrder(data.orderCreate.id);
            }
            onClose();
          }}
          onCancel={onClose}
        />
      );
      break;
    }
    case 'NEW_SHIPMENT': {
      form = (
        <ShipmentForm
          path="new"
          isSlideView
          redirectAfterSuccess={false}
          onSuccessCallback={() => {
            onClose();
          }}
          onCancel={onClose}
        />
      );
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
  }
  return (
    <SlideView isOpen={id !== ''} onRequestClose={onClose} options={{ width: '1030px' }}>
      {form}
    </SlideView>
  );
};

export default EditForm;
