// @flow
import * as React from 'react';
import { findKey, flattenDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import { BaseButton, CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { parseIcon } from 'utils/entity';
import { cloneBatchesMutation, cloneOrderItemsMutation, cloneOrdersMutation } from './mutation';
import { DialogStyle, ButtonsStyle, ConfirmMessageStyle } from './style';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: ({|
    orderIds: Array<string>,
    newOrderItemPositions: Object,
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>,
  |}) => void,
|};

export default function CloneEntities({ onSuccess }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const [cloneBatches] = useMutation(cloneBatchesMutation);
  const [cloneOrderItems] = useMutation(cloneOrderItemsMutation);
  const [cloneOrders] = useMutation(cloneOrdersMutation);
  const {
    targets,
    clone: { isOpen, isProcessing, source },
  } = state;

  const ordersIds = targetedIds(targets, ORDER);
  const hasOrderPermissions = useAllHasPermission(
    ordersIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrders = ordersIds.length;
  const itemIds = targetedIds(targets, ORDER_ITEM);
  const hasItemPermissions = useAllHasPermission(
    itemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrderItems = itemIds.length;
  const batchIds = targetedIds(targets, BATCH);
  const hasBatchPermissions = useAllHasPermission(
    batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy).filter(Boolean)
  );
  const totalBatches = batchIds.length;
  const containerIds = targetedIds(targets, CONTAINER);
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );
  const totalContainers = containerIds.length;
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );
  const totalShipments = shipmentIds.length;

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER:
        return hasOrderPermissions(permission);
      case ORDER_ITEM:
        return hasItemPermissions(permission);
      case BATCH:
        return hasBatchPermissions(permission);
      case CONTAINER:
        return hasContainerPermissions(permission);
      case SHIPMENT:
        return hasShipmentPermissions(permission);
      default:
        return false;
    }
  };

  const allowToUpdate = () => {
    switch (source) {
      case ORDER:
        return hasPermission([ORDER_CREATE]);
      case ORDER_ITEM:
        return hasPermission([ORDER_ITEMS_CREATE]);
      case BATCH:
        return hasPermission([BATCH_CREATE]);
      case CONTAINER:
        return hasPermission([CONTAINER_CREATE]);
      case SHIPMENT:
        return hasPermission([SHIPMENT_CREATE]);
      default:
        return false;
    }
  };

  const actualCloneItems = React.useRef(0);
  const actualCloneBatches = React.useRef(0);

  const onCancel = React.useCallback(() => {
    dispatch({
      type: 'CLONE_END',
      payload: {},
    });
  }, [dispatch]);

  const onConfirm = React.useCallback(() => {
    async function doMutations() {
      const actions = [];
      const sources = [];
      const orderIds = [];
      const newOrderItemPositions = {};
      const processOrderIds = [];
      if (totalBatches && source === BATCH) {
        const batchesIds = targets.filter(target => target.includes(`${BATCH}-`));
        actualCloneBatches.current = batchIds.length;
        const batches = [];
        batchesIds.forEach(target => {
          const [, batchId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem =>
              (orderItem?.batches ?? []).map(batch => batch.id).includes(batchId)
            );
          });
          if (
            mapping.orders?.[parentOrderPosition]?.id &&
            !orderIds.includes(mapping.orders?.[parentOrderPosition]?.id)
          ) {
            orderIds.push(mapping.orders?.[parentOrderPosition]?.id);
          }
          sources.push({
            type: BATCH,
            id: batchId,
          });

          batches.push({
            id: batchId,
            input: {
              shipmentId: null,
              containerId: null,
              deliveredAt: null,
              desiredAt: null,
              expiredAt: null,
              customFields: null,
              producedAt: null,
              batchQuantityRevisions: [],
            },
          });
        });

        actions.push(
          cloneBatches({
            variables: {
              batches,
            },
          })
        );
      }
      if (totalOrderItems && source === ORDER_ITEM) {
        const orderItemIds = targets.filter(target => target.includes(`${ORDER_ITEM}-`));
        actualCloneItems.current = orderItemIds.length;
        const orderItems = [];
        orderItemIds.forEach(target => {
          const [, orderItemId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem => orderItem?.id === orderItemId);
          });
          if (
            mapping.orders?.[parentOrderPosition]?.id &&
            !orderIds.includes(mapping.orders?.[parentOrderPosition]?.id)
          ) {
            orderIds.push(mapping.orders?.[parentOrderPosition]?.id);
          }
          sources.push({
            type: ORDER_ITEM,
            id: orderItemId,
          });

          // clone order item along with batches has been targeted
          orderItems.push({
            id: orderItemId,
            input: {
              batches: (mapping.entities?.orderItems?.[orderItemId]?.batches ?? [])
                .filter(batchId => targets.includes(`${BATCH}-${batchId}`))
                .map(id => ({
                  id,
                })),
            },
          });
        });

        const processBatchesIds = flattenDeep(
          orderItems.map(item => item.input.batches.map(batch => batch.id))
        );
        actualCloneBatches.current = processBatchesIds.length;

        actions.push(
          cloneOrderItems({
            variables: {
              orderItems,
            },
          })
        );
      }
      if (totalOrders && source === ORDER) {
        const orderInputIds = targets.filter(target => target.includes(`${ORDER}-`));
        const orders = [];
        orderInputIds.forEach(target => {
          const [, orderId] = target.split('-');
          sources.push({
            type: ORDER,
            id: orderId,
          });

          // clone order item along with batches has been targeted
          processOrderIds.push(orderId);
          orders.push({
            id: orderId,
            input: {
              orderItems: (mapping.entities?.orders?.[orderId]?.orderItems ?? [])
                .filter(itemId => targets.includes(`${ORDER_ITEM}-${itemId}`))
                .map(orderItemId => ({
                  id: orderItemId,
                  batches: (mapping.entities?.orderItems?.[orderItemId]?.batches ?? [])
                    .filter(batchId => targets.includes(`${BATCH}-${batchId}`))
                    .map(id => ({
                      id,
                    })),
                })),
            },
          });
        });
        // create new item when there is a batch without parent
        const processBatchesIds = flattenDeep(
          orders.map(order =>
            order.input.orderItems.map(item => item.batches.map(batch => batch.id))
          )
        );

        const batchesIds = targets.filter(target => target.includes(`${BATCH}-`));
        batchesIds.forEach(target => {
          const [, batchId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem =>
              (orderItem?.batches ?? []).map(batch => batch.id).includes(batchId)
            );
          });
          const parentOrder = mapping.orders[parentOrderPosition];
          const batch = mapping.entities?.batches[batchId];
          if (processOrderIds.includes(parentOrder?.id) && !processBatchesIds.includes(batchId)) {
            const orderItemId = findKey(mapping.entities?.orderItems, orderItem => {
              return (orderItem.batches || []).includes(batchId);
            });

            const parentItem = mapping.entities?.orderItems?.[orderItemId] ?? {
              no: 'N/A',
              price: {
                amount: 0,
                currency: parentOrder.currency,
              },
            };

            const orderMutationInput = orders.find(order => order.id === parentOrder?.id);
            const orderPosition = orders.findIndex(order => order.id === parentOrder?.id);
            if (orderMutationInput) {
              if (!newOrderItemPositions[orderPosition]) {
                newOrderItemPositions[orderPosition] = [orderMutationInput.input.orderItems.length];
              } else {
                newOrderItemPositions[orderPosition].push(
                  orderMutationInput.input.orderItems.length
                );
              }
              orderMutationInput.input.orderItems.push({
                id: parentItem.id,
                productProviderId: parentItem?.productProvider?.id,
                no: `[auto] ${parentItem?.no}`,
                quantity: batch.latestQuantity,
                price: { amount: parentItem.price.amount, currency: parentItem.price.currency },
                batches: [{ id: batchId }],
              });
            }
          }
        });

        actualCloneItems.current = flattenDeep(
          orders.map(order => order.input.orderItems.map((item: any) => item?.id)).filter(Boolean)
        ).length;
        actualCloneBatches.current = flattenDeep(
          orders.map(order =>
            order.input.orderItems.map(item => item.batches.map(batch => batch.id))
          )
        ).length;

        actions.push(
          cloneOrders({
            variables: {
              orders,
            },
          })
        );
      }
      try {
        const cloneEntities = await Promise.all(actions);
        dispatch({
          type: 'CLONE_END',
          payload: {
            sources,
            cloneEntities,
          },
        });
        onSuccess({ sources, cloneEntities, orderIds, newOrderItemPositions });
      } catch (error) {
        dispatch({
          type: 'CLONE_END',
          payload: {
            error,
          },
        });
      }
    }
    dispatch({
      type: 'CLONE_START',
      payload: {},
    });
    doMutations();
  }, [
    batchIds.length,
    cloneBatches,
    cloneOrderItems,
    cloneOrders,
    dispatch,
    mapping.entities,
    mapping.orders,
    onSuccess,
    source,
    targets,
    totalBatches,
    totalOrderItems,
    totalOrders,
  ]);

  const noPermission = !allowToUpdate();

  if (noPermission) {
    switch (source) {
      case ORDER:
        return (
          <Dialog isOpen={isOpen} width="400px">
            <div className={DialogStyle}>
              <h3 className={ConfirmMessageStyle}>
                <FormattedMessage
                  id="modules.RelationMap.clone.noOrderPermission"
                  defaultMessage="At least one {source} {entity}, Item {itemIcon}, Batch {batchIcon} selected does not allow you to clone.Please reselect and try again."
                  values={{
                    source,
                    entity: <Icon icon={parseIcon(source)} />,
                    itemIcon: <Icon icon={parseIcon('OrderItem')} />,
                    batchIcon: <Icon icon={parseIcon('Batch')} />,
                  }}
                />
              </h3>
              <div className={ButtonsStyle}>
                <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
              </div>
            </div>
          </Dialog>
        );
      case ORDER_ITEM:
        return (
          <Dialog isOpen={isOpen} width="400px">
            <div className={DialogStyle}>
              <h3 className={ConfirmMessageStyle}>
                <FormattedMessage
                  id="modules.RelationMap.clone.noItemPermission"
                  defaultMessage="At least one {source} {entity}, Batch {batchIcon} selected does not allow you to clone.Please reselect and try again."
                  values={{
                    source,
                    entity: <Icon icon={parseIcon(source)} />,
                    batchIcon: <Icon icon={parseIcon('Batch')} />,
                  }}
                />
              </h3>
              <div className={ButtonsStyle}>
                <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
              </div>
            </div>
          </Dialog>
        );

      default:
        return (
          <Dialog isOpen={isOpen} width="400px">
            <div className={DialogStyle}>
              <h3 className={ConfirmMessageStyle}>
                <FormattedMessage
                  id="modules.RelationMap.clone.noPermission"
                  defaultMessage="At least one {source} {entity} selected does not allow you to clone.Please reselect and try again."
                  values={{
                    source,
                    entity: <Icon icon={parseIcon(source)} />,
                  }}
                />
              </h3>
              <div className={ButtonsStyle}>
                <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
              </div>
            </div>
          </Dialog>
        );
    }
  }

  return (
    <Dialog isOpen={isOpen} width="400px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          {isProcessing ? (
            <>
              <FormattedMessage
                id="modules.RelationMap.clone.process"
                defaultMessage="Cloning.. {source} ..."
                values={{
                  source: (
                    <>
                      {totalOrders > 0 && source === ORDER && (
                        <>
                          {totalOrders} <Icon icon="ORDER" /> Orders
                        </>
                      )}
                      {totalOrderItems > 0 && source === ORDER_ITEM && (
                        <>
                          {totalOrderItems} <Icon icon="ORDER_ITEM" /> Items
                        </>
                      )}
                      {totalBatches > 0 && source === BATCH && (
                        <>
                          {totalBatches} <Icon icon="BATCH" /> Batches
                        </>
                      )}
                      {totalContainers > 0 && source === CONTAINER && (
                        <>
                          {totalContainers} <Icon icon="CONTAINER" /> Containers
                        </>
                      )}
                      {totalShipments > 0 && source === SHIPMENT && (
                        <>
                          {totalShipments} <Icon icon="SHIPMENT" /> Shipments
                        </>
                      )}
                    </>
                  ),
                }}
              />
              <LoadingIcon />
            </>
          ) : (
            <FormattedMessage
              id="modules.RelationMap.clone.guideline"
              defaultMessage="Are you sure you want to clone {source}"
              values={{
                source: (
                  <>
                    {totalOrders > 0 && source === ORDER && (
                      <>
                        {totalOrders} Orders <Icon icon="ORDER" /> ? Any selected Items
                        <Icon icon="ORDER_ITEM" />
                        or Batches
                        <Icon icon="BATCH" />
                        will also be cloned within the cloned Orders
                        <Icon icon="ORDER" />
                      </>
                    )}
                    {totalOrderItems > 0 && source === ORDER_ITEM && (
                      <>
                        {totalOrderItems} Items <Icon icon="ORDER_ITEM" /> ? Any selected Batches
                        <Icon icon="BATCH" />
                        will also be cloned within the cloned Items
                        <Icon icon="ORDER_ITEM" />
                      </>
                    )}
                    {totalBatches > 0 && source === BATCH && (
                      <>
                        {totalBatches} Batches <Icon icon="BATCH" />
                      </>
                    )}
                    {totalContainers > 0 && source === CONTAINER && (
                      <>
                        {totalContainers} <Icon icon="CONTAINER" />
                      </>
                    )}
                    {totalShipments > 0 && source === SHIPMENT && (
                      <>
                        {totalShipments} <Icon icon="SHIPMENT" />
                      </>
                    )}
                  </>
                ),
              }}
            />
          )}
        </h3>

        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <BaseButton
            label={
              <FormattedMessage id="modules.RelationMaps.label.clone" defaultMessage="CLONE" />
            }
            isLoading={Boolean(isProcessing)}
            disabled={Boolean(isProcessing)}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
