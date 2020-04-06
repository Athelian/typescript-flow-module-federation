// @flow
import * as React from 'react';
import { useLazyQuery } from 'react-apollo';
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
import useUser from 'hooks/useUser';
import SlideView from 'components/SlideView';
import LoadingIcon from 'components/LoadingIcon';
import OrderForm from 'modules/order/index.form';
import {
  orderFullFocusDetailQuery,
  shipmentFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
// FIXME: binding date is not working yet
import ShipmentForm from 'modules/shipment/index.form';
import { ORDER, ORDER_ITEM, SHIPMENT } from 'modules/relationMapV2/constants';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import {
  targetedIds,
  findShipmentIdByContainer,
  findOrderIdByItem,
} from 'modules/relationMapV2/helpers';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { isEquals } from 'utils/fp';
import { ordersAndShipmentsQuery } from './query';

type Props = {|
  onClose: (
    ?{
      moveToTop: boolean,
      id: string,
      type: string,
    }
  ) => void,
|};

const EditFormSlideView = ({ onClose }: Props) => {
  const { isImporter, organization } = useUser();
  const isReady = React.useRef(true);
  const { dispatch, state } = FocusedView.useContainer();
  const [fetchOrdersAndShipments, { called, loading, data = {} }] = useLazyQuery(
    ordersAndShipmentsQuery,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const { type, selectedId: id } = state.edit;
  const { mapping, onSetBadges } = Entities.useContainer();
  const onRequestClose = React.useCallback(() => {
    if (isReady.current) {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    const listener = emitter.addListener('MUTATION', (result: Object) => {
      isReady.current = !!result;
      // reload order if order or item updated on the form
      if (
        state.viewer === 'Order' &&
        (result?.data?.orderItemUpdate || result?.data?.orderUpdate)
      ) {
        if (result?.data?.orderUpdate?.id) {
          const orderId = result?.data?.orderUpdate?.id;
          if (orderId) {
            apolloClient
              .query({
                query: orderFullFocusDetailQuery,
                variables: {
                  ids: [orderId],
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_ORDERS',
                  payload: {
                    orders: refetchResult.data.ordersByIDs,
                  },
                });
              });
          }
        }

        if (result?.data?.orderItemUpdate?.id) {
          const orderItemId = result?.data?.orderItemUpdate?.id;
          if (orderItemId) {
            apolloClient
              .query({
                query: orderFullFocusDetailQuery,
                variables: {
                  ids: [
                    findOrderIdByItem({
                      viewer: 'ORDER',
                      orderItemId,
                      entities: mapping?.entities,
                    }),
                  ].filter(Boolean),
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_ORDERS',
                  payload: {
                    orders: refetchResult.data.ordersByIDs,
                  },
                });
              });
          }
        }
      }

      // reload shipment if shipment or container has update on the form
      if (
        state.viewer !== 'Order' &&
        (result?.data?.shipmentUpdate?.id || result?.data?.containerUpdate?.id)
      ) {
        if (result?.data?.shipmentUpdate?.id) {
          const shipmentId = result?.data?.shipmentUpdate?.id;
          if (shipmentId) {
            apolloClient
              .query({
                query: shipmentFullFocusDetailQuery,
                variables: {
                  ids: [shipmentId],
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_SHIPMENTS',
                  payload: {
                    shipments: refetchResult.data.shipmentsByIDs,
                  },
                });
              });
          }
        }

        if (result?.data?.containerUpdate?.id) {
          const containerId = result?.data?.containerUpdate?.id;
          if (containerId) {
            apolloClient
              .query({
                query: shipmentFullFocusDetailQuery,
                variables: {
                  ids: [findShipmentIdByContainer(containerId, mapping?.entities)].filter(Boolean),
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_SHIPMENTS',
                  payload: {
                    shipments: refetchResult.data.shipmentsByIDs,
                  },
                });
              });
          }
        }
      }
    });
    return () => {
      listener.remove();
    };
  }, [dispatch, mapping, state.viewer]);

  const orderIds = state.edit.orderIds || [];
  const shipmentIds = state.edit.shipmentIds || [];
  const lastQueryVariables = usePrevious({
    orderIds,
    shipmentIds,
  });
  React.useEffect(() => {
    if (
      ['MOVE_BATCHES', 'MOVE_ITEMS'].includes(type) &&
      id !== '' &&
      !isEquals(lastQueryVariables, {
        orderIds,
        shipmentIds,
      })
    ) {
      fetchOrdersAndShipments({
        variables: {
          orderIds,
          shipmentIds,
        },
      });
    }
  }, [fetchOrdersAndShipments, id, lastQueryVariables, orderIds, shipmentIds, type]);

  let form = null;
  let isNewEntity = false;
  switch (type) {
    case ORDER: {
      form = <OrderForm orderId={encodeId(id)} isSlideView />;
      break;
    }
    case SHIPMENT: {
      form = <ShipmentForm shipmentId={encodeId(id)} isSlideView />;
      break;
    }
    case 'MOVE_ITEMS': {
      const itemIds = targetedIds(state.targets, ORDER_ITEM);
      const newOrderItems = [];
      logger.warn({
        itemIds,
      });
      if (
        called &&
        isEquals(lastQueryVariables, {
          orderIds,
          shipmentIds,
        }) &&
        !loading
      ) {
        const { ordersByIDs } = data;
        itemIds.forEach(orderItemId => {
          const parentOrder = ordersByIDs.find(order =>
            (order?.orderItems ?? []).map(item => item.id).includes(orderItemId)
          );
          const parentItem = (parentOrder?.orderItems ?? []).find(item => item.id === orderItemId);
          newOrderItems.push(parentItem);
        });
      }
      const { exporter } = data?.ordersByIDs?.[0] ?? {};
      if (loading) {
        form = <LoadingIcon />;
      } else {
        isNewEntity = true;
        if (id) {
          form = (
            <NewOrderForm
              originalDataForSlideView={{
                orderItems: newOrderItems,
              }}
              initDataForSlideView={{
                importer: isImporter() ? organization : {},
                exporter,
                orderItems: newOrderItems.map(item => ({
                  ...item,
                  no: `[move] ${item.no}`,
                })),
              }}
              onSuccessCallback={result => {
                onSetBadges([
                  {
                    id: result.orderCreate.id,
                    type: 'newItem',
                    entity: 'order',
                  },
                ]);
                dispatch({
                  type: 'NEW_ORDER',
                  payload: {
                    orderId: result.orderCreate.id,
                  },
                });
                onClose({
                  moveToTop: true,
                  id: result.orderCreate.id,
                  type: ORDER,
                });
                dispatch({
                  type: 'MOVE_ITEM_END',
                  payload: {},
                });
              }}
              onCancel={onClose}
            />
          );
        }
      }
      break;
    }
    default: {
      form = null;
      break;
    }
  }
  return (
    <SlideView
      isOpen={id !== ''}
      onRequestClose={onRequestClose}
      shouldConfirm={() => {
        return isNewEntity || !!document.querySelector('#resetBtn');
      }}
    >
      {form}
    </SlideView>
  );
};

export default EditFormSlideView;
