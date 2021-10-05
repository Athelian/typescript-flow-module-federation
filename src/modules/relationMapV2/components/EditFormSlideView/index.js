// @flow
import * as React from 'react';
import { useLazyQuery } from 'react-apollo';
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
import useUser from 'hooks/useUser';
import SlideView from 'components/SlideView';
import LoadingIcon from 'components/LoadingIcon';
import OrderForm from 'modules/order/index.form';
import ItemForm from 'modules/orderItem/index.form';
import BatchForm from 'modules/batch/index.form';
import ContainerForm from 'modules/container/index.form';
import {
  orderFullFocusDetailQuery,
  shipmentFullFocusDetailQuery,
} from 'modules/relationMapV2/query';
// FIXME: binding date is not working yet
import RMEditTasks from 'modules/relationMapV2/components/RMEditTasks';
import ShipmentForm from 'modules/shipment/index.form';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, CONTAINER } from 'modules/relationMapV2/constants';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import {
  targetedIds,
  findParentIdsByBatch,
  findShipmentIdByContainer,
  findOrderIdByItem,
} from 'modules/relationMapV2/helpers';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import NewShipmentForm from 'modules/shipment/common/NewShipmentForm';
import NewContainerForm from 'modules/shipment/common/NewContainerForm';
import { generateItemForMovedBatch } from 'utils/item';
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
    },
    dontClose?: boolean
  ) => void,
|};

const EditFormSlideView = ({ onClose }: Props) => {
  const { user, isExporter, isImporter, isForwarder, organization } = useUser();
  const isReady = React.useRef(true);
  const { dispatch, state } = FocusedView.useContainer();
  const [fetchOrdersAndShipments, { called, loading, data = {} }] = useLazyQuery(
    ordersAndShipmentsQuery,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const { type, selectedId: id, defaultSection } = state.edit;
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
    case ORDER_ITEM: {
      form = <ItemForm orderItemId={encodeId(id)} isSlideView />;
      break;
    }
    case BATCH: {
      form = <BatchForm batchId={encodeId(id)} isSlideView />;
      break;
    }
    case CONTAINER: {
      form = <ContainerForm containerId={encodeId(id)} isSlideView />;
      break;
    }
    case SHIPMENT: {
      form = <ShipmentForm shipmentId={encodeId(id)} defaultSection={defaultSection} isSlideView />;
      break;
    }
    case 'TASKS': {
      form = (
        <RMEditTasks
          orderIds={targetedIds(state.targets, ORDER)}
          orderItemIds={targetedIds(state.targets, ORDER_ITEM)}
          batchIds={targetedIds(state.targets, BATCH)}
          shipmentIds={targetedIds(state.targets, SHIPMENT)}
        />
      );
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
    case 'MOVE_BATCHES': {
      const batchIds = targetedIds(state.targets, BATCH);
      const newOrderItems = [];
      const newContainers = [];
      const newShipments = [];
      const newBatches = [];
      logger.warn({
        batchIds,
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
        batchIds.forEach(batchId => {
          const [orderItemId] = findParentIdsByBatch({
            batchId,
            viewer: state.viewer,
            entities: state.targetEntities ?? {},
          });
          const parentOrder = ordersByIDs.find(order =>
            (order?.orderItems ?? []).map(item => item.id).includes(orderItemId)
          );
          const parentItem = (parentOrder?.orderItems ?? []).find(item => item.id === orderItemId);
          const batch = (parentItem?.batches ?? []).find(
            currentBatch => currentBatch.id === batchId
          );
          if (batch && parentItem) {
            newBatches.push(batch);
            const { id: itemId, ...item } = parentItem;
            if (batch.container && !newContainers.includes(batch.container)) {
              newContainers.push(batch.container);
            }
            if (batch.shipment && !newShipments.includes(batch.shipment)) {
              newShipments.push(batch.shipment);
            }
            newOrderItems.push(generateItemForMovedBatch(item, batch));
          }
        });
      }
      const { importer, exporter } = data?.ordersByIDs?.[0] ?? {};
      if (loading) {
        form = <LoadingIcon />;
      } else {
        isNewEntity = true;
        switch (id) {
          case 'newOrder':
            form = (
              <NewOrderForm
                originalDataForSlideView={{
                  orderItems: newOrderItems.map(item => ({
                    id: item.id,
                    isNew: true,
                    batches: item.batches.map(batch => ({
                      ...batch,
                      quantity: 0,
                      isNew: true,
                    })),
                  })),
                }}
                initDataForSlideView={{
                  importer: isImporter() ? organization : {},
                  exporter,
                  orderItems: newOrderItems,
                  containers: newContainers,
                  shipments: newShipments,
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
                    type: 'MOVE_BATCH_END',
                    payload: {},
                  });
                }}
                onCancel={onClose}
              />
            );
            break;
          case 'newShipment':
            form = (
              <NewShipmentForm
                initDataForSlideView={{
                  importer: isImporter() ? importer : null,
                  forwarders: isForwarder() ? [organization] : [],
                  exporter: isExporter() ? exporter : null,
                  batches: newBatches.map(batch => ({ ...batch, container: null, shipment: null })),
                  containers: [],
                }}
                onSuccessCallback={result => {
                  onSetBadges([
                    {
                      id: result.shipmentCreate.id,
                      type: 'newItem',
                      entity: 'shipment',
                    },
                  ]);
                  dispatch({
                    type: 'NEW_SHIPMENT',
                    payload: {
                      shipmentId: result.shipmentCreate.id,
                    },
                  });
                  onClose({
                    moveToTop: true,
                    id: result.shipmentCreate.id,
                    type: SHIPMENT,
                  });
                  dispatch({
                    type: 'MOVE_BATCH_END',
                    payload: {},
                  });
                }}
                onCancel={onClose}
              />
            );
            break;
          default:
            form = (
              <NewContainerForm
                shipmentId={state.edit.shipment?.id ?? ''}
                container={{
                  importer,
                  exporter: isExporter() ? exporter : null,
                  batches: newBatches.map(batch => ({
                    ...batch,
                    shipment: state.edit.shipment,
                  })),
                  shipment: state.edit.shipment,
                }}
                onSuccessCallback={container => {
                  onSetBadges([
                    {
                      id: container.containerCreate.id,
                      type: 'newItem',
                      entity: 'container',
                    },
                  ]);
                  onClose({
                    moveToTop: true,
                    id: container.containerCreate.id,
                    type: CONTAINER,
                  });
                  dispatch({
                    type: 'MOVE_BATCH_END',
                    payload: {
                      container: container.containerCreate,
                    },
                  });
                }}
                user={user}
              />
            );
            break;
        }
      }
      break;
    }
    case 'NEW_ORDER': {
      isNewEntity = true;
      form = (
        <NewOrderForm
          initDataForSlideView={{
            importer: isImporter() ? organization : {},
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
            onClose(
              {
                moveToTop: true,
                id: result.orderCreate.id,
                type: ORDER,
              },
              true
            );
            dispatch({
              type: 'EDIT',
              payload: {
                type: ORDER,
                selectedId: result.orderCreate.id,
              },
            });
          }}
          onCancel={onClose}
        />
      );
      break;
    }
    case 'NEW_SHIPMENT': {
      isNewEntity = true;
      form = (
        <NewShipmentForm
          initDataForSlideView={{
            importer: isImporter() ? organization : null,
            forwarders: isForwarder() ? [organization] : [],
            exporter: isExporter() ? organization : null,
          }}
          onSuccessCallback={result => {
            onSetBadges([
              {
                id: result.shipmentCreate.id,
                type: 'newItem',
                entity: 'shipment',
              },
            ]);
            dispatch({
              type: 'NEW_SHIPMENT',
              payload: {
                shipmentId: result.shipmentCreate.id,
              },
            });
            onClose(
              {
                moveToTop: true,
                id: result.shipmentCreate.id,
                type: SHIPMENT,
              },
              true
            );
            dispatch({
              type: 'EDIT',
              payload: {
                type: SHIPMENT,
                selectedId: result.shipmentCreate.id,
              },
            });
          }}
          onCancel={onClose}
        />
      );
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
