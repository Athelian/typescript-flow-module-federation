// @flow
import * as React from 'react';
import client from 'apollo';
import { orderDetailQuery } from 'modules/relationMap/order/query';
import SlideView from 'components/SlideView';
import OrderForm from 'modules/order/index.form';
import ItemForm from 'modules/orderItem/index.form';
import BatchForm from 'modules/batch/index.form';
import ShipmentForm from 'modules/shipment/index.form';
import ActionDispatch from 'modules/relationMap/order/provider';
import { actionCreators } from 'modules/relationMap/order/store';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { getByPath } from 'utils/fp';

type OptionalProps = {
  extra?: any,
};

type Props = OptionalProps & {
  type: string,
  selectedId: string,
  onClose: () => void,
};

const EditForm = ({ type, selectedId: id, onClose, extra }: Props) => {
  let form = null;
  const context = React.useContext(ActionDispatch);
  const { dispatch } = context;
  const actions = actionCreators(dispatch);
  React.useEffect(() => {
    emitter.once('CHANGE_ORDER_STATUS', () => {
      client.reFetchObservableQueries();
    });
  });
  switch (type) {
    default: {
      form = null;
      break;
    }
    case 'NEW_ORDER': {
      form = (
        <OrderForm
          path="new"
          initDataForSlideView={extra}
          isSlideView
          redirectAfterSuccess={false}
          onSuccessCallback={data => {
            if (data.orderCreate.id) {
              actions.addNew('ORDER', data.orderCreate.id);
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
          initDataForSlideView={extra}
          redirectAfterSuccess={false}
          onSuccessCallback={data => {
            if (data.shipmentCreate.id) {
              actions.addNew('SHIPMENT', data.shipmentCreate.id);
              const allOrderIds = [];
              const { batches = [] } = data.shipmentCreate;
              batches.forEach(batch => {
                const orderId = getByPath('orderItem.order.id', batch);
                if (orderId && !allOrderIds.includes(orderId)) {
                  allOrderIds.push(orderId);
                }
              });
              Promise.all(
                allOrderIds.map(orderId =>
                  client.query({
                    query: orderDetailQuery,
                    variables: {
                      id: orderId,
                    },
                  })
                )
              )
                .then(logger.warn)
                .catch(logger.error);
            }
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
    case 'ORDER_ITEM': {
      form = <ItemForm orderItemId={encodeId(id)} isSlideView />;
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
    <SlideView isOpen={id !== ''} onRequestClose={onClose}>
      {form}
    </SlideView>
  );
};

export default EditForm;
