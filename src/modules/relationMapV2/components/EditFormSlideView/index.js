// @flow
import * as React from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import { findKey } from 'lodash';
import usePrevious from 'hooks/usePrevious';
import useUser from 'hooks/useUser';
import SlideView from 'components/SlideView';
import LoadingIcon from 'components/LoadingIcon';
import OrderForm from 'modules/order/index.form';
import ItemForm from 'modules/orderItem/index.form';
import BatchForm from 'modules/batch/index.form';
import ContainerForm from 'modules/container/index.form';
import ContainerFormInSlide from 'modules/container/common/ContainerFormInSlide';
// FIXME: binding date is not working yet
import RMEditTasks from 'modules/relationMap/order/components/RMEditTasks';
import { prepareParsedContainerInput } from 'modules/container/form/mutation';
import ShipmentForm from 'modules/shipment/index.form';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, CONTAINER } from 'modules/relationMapV2/constants';
import { Entities, OrderFocused } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/components/OrderFocus/helpers';
import { encodeId, uuid } from 'utils/id';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { isEquals } from 'utils/fp';
import NewOrderForm from './components/NewOrderForm';
import { ordersAndShipmentsQuery } from './query';
import { createContainerMutation } from './mutation';

const defaultItemValues = {
  customFields: {
    mask: null,
    fieldValues: [],
  },
  todo: {
    tasks: [],
  },
  tags: [],
  files: [],
  memo: '',
};

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
  const { isExporter } = useUser();
  const isReady = React.useRef(true);
  const { dispatch, state } = OrderFocused.useContainer();
  const [createContainer] = useMutation(createContainerMutation);
  const [fetchOrdersAndShipments, { called, loading, data = {} }] = useLazyQuery(
    ordersAndShipmentsQuery,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const { type, selectedId: id } = state.edit;
  const { mapping, checkRemoveEntities, onSetBadges } = Entities.useContainer();
  const onRequestClose = React.useCallback(() => {
    if (isReady.current) {
      onClose();
    }
  }, [onClose]);

  const orders = mapping?.entities?.orders ?? {};
  const orderItems = mapping?.entities?.orderItems ?? {};
  React.useEffect(() => {
    const listener = emitter.addListener('MUTATION', (result: Object) => {
      isReady.current = !!result;
      const entity = result?.data?.orderItemUpdate || result?.data?.orderUpdate;
      if (entity) {
        dispatch({
          type: 'RECHECK_TARGET',
          payload: {
            ...result.data,
            mapping: {
              orderItems,
              orders,
            },
          },
        });
        checkRemoveEntities(entity);
      }
    });
    return () => {
      listener.remove();
    };
  }, [checkRemoveEntities, dispatch, orderItems, orders]);

  const orderIds = state.edit.orderIds || [];
  const shipmentIds = state.edit.shipmentIds || [];
  const lastQueryVariables = usePrevious({
    orderIds,
    shipmentIds,
  });
  React.useEffect(() => {
    if (
      type === 'MOVE_BATCHES' &&
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
      form = <ShipmentForm shipmentId={encodeId(id)} isSlideView />;
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
          const orderItemId = findKey(mapping.entities?.orderItems, orderItem => {
            return (orderItem.batches || []).includes(batchId);
          });
          const parentOrder = ordersByIDs.find(order =>
            order.orderItems.map(item => item.id).includes(orderItemId)
          );
          const parentItem = parentOrder.orderItems.find(item => item.id === orderItemId);
          const batch = parentItem.batches.find(currentBatch => currentBatch.id === batchId);
          if (batch && parentItem) {
            newBatches.push(batch);
            const { id: itemId, ...item } = parentItem;
            if (batch.container && !newContainers.includes(batch.container)) {
              newContainers.push(batch.container);
            }
            if (batch.shipment && !newShipments.includes(batch.shipment)) {
              newShipments.push(batch.shipment);
            }
            newOrderItems.push({
              ...item,
              ...defaultItemValues,
              no: `[auto] ${item.no}`,
              quantity: 0,
              isNew: true,
              id: uuid(),
              batches: [batch],
            });
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
                path="new"
                isSlideView
                redirectAfterSuccess={false}
                originalDataForSlideView={{
                  orderItems: newOrderItems.map(item => ({
                    ...defaultItemValues,
                    id: item.id,
                    isNew: true,
                    batches: item.batches.map(batch => ({
                      ...batch,
                      isNew: true,
                    })),
                  })),
                }}
                initDataForSlideView={{
                  importer,
                  exporter,
                  orderItems: newOrderItems.map(item => ({
                    ...item,
                    ...defaultItemValues,
                    no: `[auto] ${item.no}`,
                    quantity: 0,
                  })),
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
                }}
                onCancel={onClose}
              />
            );
            break;
          case 'newShipment':
            form = (
              <ShipmentForm
                path="new"
                isSlideView
                redirectAfterSuccess={false}
                initDataForSlideView={{
                  importer,
                  exporter: isExporter() ? exporter : null,
                  batches: newBatches,
                  containers: newContainers,
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
                      orderId: result.shipmentCreate.id,
                    },
                  });
                  onClose({
                    moveToTop: true,
                    id: result.shipmentCreate.id,
                    type: SHIPMENT,
                  });
                }}
                onCancel={onClose}
              />
            );
            break;
          default:
            form = (
              <ContainerFormInSlide
                container={{
                  importer,
                  exporter: isExporter() ? exporter : null,
                  batches: newBatches.map(batch => ({
                    ...batch,
                    shipment: state.edit.shipment,
                  })),
                  shipment: state.edit.shipment,
                }}
                onSave={container => {
                  createContainer({
                    variables: {
                      input: {
                        ...prepareParsedContainerInput({
                          originalValues: null,
                          existingBatches: newBatches,
                          newValues: container,
                          location: {
                            inContainerForm: true,
                            inShipmentForm: false,
                          },
                        }),
                        shipmentId: Number(state.edit.shipment?.id ?? ''),
                      },
                    },
                  })
                    .then(result => {
                      onSetBadges([
                        {
                          id: result.data.containerCreate.id,
                          type: 'newItem',
                          entity: 'container',
                        },
                      ]);
                      dispatch({
                        type: 'NEW_CONTAINER',
                        payload: {
                          orderId: result.data.containerCreate.id,
                        },
                      });
                      onClose({
                        moveToTop: true,
                        id: result.data.containerCreate.id,
                        type: CONTAINER,
                      });
                    })
                    .catch(onClose);
                }}
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
          path="new"
          isSlideView
          redirectAfterSuccess={false}
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
