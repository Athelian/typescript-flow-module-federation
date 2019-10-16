// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { findKey, flattenDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { SHIPMENT_CREATE } from 'modules/permission/constants/shipment';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ActionDialog, {
  OrdersLabelIcon,
  OrderLabelIcon,
  ItemsLabelIcon,
  ItemLabelIcon,
  BatchesLabelIcon,
  BatchLabelIcon,
  ShipmentLabelIcon,
  ShipmentsLabelIcon,
  ContainerLabelIcon,
  ContainersLabelIcon,
} from '../ActionDialog';
import {
  cloneBatchesMutation,
  cloneOrderItemsMutation,
  cloneOrdersMutation,
  cloneShipmentsMutation,
  cloneContainersMutation,
} from './mutation';

type Props = {|
  onSuccess: ({|
    orderIds: Array<string>,
    shipmentIds: Array<string>,
    newOrderItemPositions: Object,
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>,
  |}) => void,
|};

export default function CloneEntities({ onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const [cloneBatches] = useMutation(cloneBatchesMutation);
  const [cloneOrderItems] = useMutation(cloneOrderItemsMutation);
  const [cloneOrders] = useMutation(cloneOrdersMutation);
  const [cloneShipments] = useMutation(cloneShipmentsMutation);
  const [cloneContainers] = useMutation(cloneContainersMutation);
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
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );
  const totalShipments = shipmentIds.length;
  const containerIds = targetedIds(targets, CONTAINER);
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );
  const totalContainers = containerIds.length;

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER:
        return hasOrderPermissions(permission);
      case ORDER_ITEM:
        return hasItemPermissions(permission);
      case BATCH:
        return hasBatchPermissions(permission);
      case SHIPMENT:
        return hasShipmentPermissions(permission);
      case CONTAINER:
        return hasContainerPermissions(permission);
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
      case SHIPMENT:
        return hasPermission([SHIPMENT_CREATE]);
      case CONTAINER:
        return hasPermission([CONTAINER_CREATE]);
      default:
        return false;
    }
  };

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
      const processShipmentIds = [];
      const processContainerIds = [];
      if (totalBatches && source === BATCH) {
        const batches = [];
        batchIds.forEach(batchId => {
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
              // TODO: fix for clone batch on shipment view
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
        const orderItems = [];
        itemIds.forEach(orderItemId => {
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

        actions.push(
          cloneOrderItems({
            variables: {
              orderItems,
            },
          })
        );
      }
      if (totalOrders && source === ORDER) {
        const orders = [];
        ordersIds.forEach(orderId => {
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

        batchIds.forEach(batchId => {
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

        actions.push(
          cloneOrders({
            variables: {
              orders,
            },
          })
        );
      }
      if (totalShipments && source === SHIPMENT) {
        const shipments = [];
        shipmentIds.forEach(shipmentId => {
          sources.push({
            type: SHIPMENT,
            id: shipmentId,
          });

          // clone container along with batches has been targeted
          processShipmentIds.push(shipmentId);
          shipments.push({
            id: shipmentId,
            input: {
              no: `[cloned][${Date.now()}] ${mapping.entities?.shipments?.[shipmentId]?.no}`,
              batches: (mapping.entities?.shipments?.[shipmentId]?.batches ?? [])
                .filter(batchId => targets.includes(`${BATCH}-${batchId}`))
                .map(id => ({
                  id,
                  // TODO: confirm with Maxime
                  ...(mapping.entities?.batches?.[id]?.container ? { containerId: null } : {}),
                })),
              containers: (mapping.entities?.shipments?.[shipmentId]?.containers ?? [])
                .filter(containerId => targets.includes(`${CONTAINER}-${containerId}`))
                .map(containerId => ({
                  id: containerId,
                  batches: Object.keys(mapping.entities?.batches ?? {})
                    .filter(
                      batchId =>
                        mapping.entities?.batches?.[batchId]?.container === containerId &&
                        targets.includes(`${BATCH}-${batchId}`)
                    )
                    .map(id => ({
                      id,
                    })),
                })),
            },
          });
        });
        actions.push(
          cloneShipments({
            variables: {
              shipments,
            },
          })
        );
      }
      if (totalContainers && source === CONTAINER) {
        const containers = [];
        containerIds.forEach(containerId => {
          sources.push({
            type: CONTAINER,
            id: containerId,
          });

          // clone container along with batches has been targeted
          processContainerIds.push(containerId);
          containers.push({
            id: containerId,
            input: {
              no: `[cloned][${Date.now()}] ${mapping.entities?.containers?.[containerId]?.no}`,
              batches: Object.keys(mapping.entities?.batches ?? {})
                .filter(
                  batchId =>
                    targets.includes(`${BATCH}-${batchId}`) &&
                    mapping.entities?.batches?.[batchId]?.container === containerId
                )
                .map(id => ({
                  id,
                })),
            },
          });
        });
        actions.push(
          cloneContainers({
            variables: {
              containers,
            },
          })
        );
      }
      try {
        const cloneEntities = await Promise.all(actions);
        onSuccess({
          sources,
          cloneEntities,
          orderIds,
          shipmentIds,
          newOrderItemPositions,
        });
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
    batchIds,
    cloneBatches,
    cloneContainers,
    cloneOrderItems,
    cloneOrders,
    cloneShipments,
    containerIds,
    dispatch,
    itemIds,
    mapping.entities,
    mapping.orders,
    onSuccess,
    ordersIds,
    shipmentIds,
    source,
    targets,
    totalBatches,
    totalContainers,
    totalOrderItems,
    totalOrders,
    totalShipments,
  ]);

  const noPermission = !allowToUpdate();

  let dialogMessage = null;
  let dialogSubMessage = null;

  const numOfOrders = <FormattedNumber value={totalOrders} />;
  const numOfItems = <FormattedNumber value={totalOrderItems} />;
  const numOfBatches = <FormattedNumber value={totalBatches} />;
  const numOfShipments = <FormattedNumber value={totalShipments} />;
  const numOfContainers = <FormattedNumber value={totalContainers} />;

  switch (source) {
    case ORDER:
      if (noPermission) {
        // No permission to clone Orders
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.noOrderPermission"
            defaultMessage="At least one {orderLabel}, {itemLabel}, or {batchLabel} selected does not allow you to clone."
            values={{
              orderLabel: <OrderLabelIcon />,
              itemLabel: <ItemLabelIcon />,
              batchLabel: <BatchLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.actions.tryAgain"
            defaultMessage="Please reselect and try again."
          />
        );
      } else if (isProcessing) {
        // Is currently cloning Orders
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.cloningOrders"
            defaultMessage="Cloning {numOfOrders} {ordersLabel} ..."
            values={{
              numOfOrders,
              ordersLabel: totalOrders > 1 ? <OrdersLabelIcon /> : <OrderLabelIcon />,
            }}
          />
        );
      } else {
        // Has permission to clone Orders
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.orderMessage1"
            defaultMessage="Are you sure you want to clone {numOfOrders} {ordersLabel} that you have selected?"
            values={{
              numOfOrders,
              ordersLabel: totalOrders > 1 ? <OrdersLabelIcon /> : <OrderLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.orderMessage2"
            defaultMessage="Any selected {itemsLabel} or {batchesLabel} will also be cloned within the cloned {ordersLabel}"
            values={{
              itemsLabel: <ItemsLabelIcon />,
              batchesLabel: <BatchesLabelIcon />,
              ordersLabel: totalOrders > 1 ? <OrdersLabelIcon /> : <OrderLabelIcon />,
            }}
          />
        );
      }
      break;
    case ORDER_ITEM:
      if (noPermission) {
        // No permission to clone Items
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.noItemPermission"
            defaultMessage="At least one {itemLabel} or {batchLabel} selected does not allow you to clone."
            values={{
              itemLabel: <ItemLabelIcon />,
              batchLabel: <BatchLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.actions.tryAgain"
            defaultMessage="Please reselect and try again."
          />
        );
      } else if (isProcessing) {
        // Is currently cloning Items
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.cloningItems"
            defaultMessage="Cloning {numOfItems} {itemsLabel} ..."
            values={{
              numOfItems,
              itemsLabel: totalOrderItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />,
            }}
          />
        );
      } else {
        // Has permission to clone Items
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.itemMessage1"
            defaultMessage="Are you sure you want to clone {numOfItems} {itemsLabel} that you have selected?"
            values={{
              numOfItems,
              itemsLabel: totalOrderItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.itemMessage2"
            defaultMessage="Any selected {batchesLabel} will also be cloned within the cloned {itemsLabel}"
            values={{
              batchesLabel: <BatchesLabelIcon />,
              itemsLabel: totalOrderItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />,
            }}
          />
        );
      }
      break;
    case BATCH:
      if (noPermission) {
        // No permission to clone Batches
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.noBatchPermission"
            defaultMessage="At least one {batchLabel} selected does not allow you to clone."
            values={{
              batchLabel: <BatchLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.actions.tryAgain"
            defaultMessage="Please reselect and try again."
          />
        );
      } else if (isProcessing) {
        // Is currently cloning Batches
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.cloningBatches"
            defaultMessage="Cloning {numOfBatches} {batchesLabel} ..."
            values={{
              numOfBatches,
              batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
            }}
          />
        );
      } else {
        // Has permission to clone Batches
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.batchMessage1"
            defaultMessage="Are you sure you want to clone {numOfBatches} {batchesLabel} that you have selected?"
            values={{
              numOfBatches,
              batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
            }}
          />
        );
      }
      break;
    case SHIPMENT:
      if (noPermission) {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.noShipmentPermission"
            defaultMessage="At least one {shipmentLabel}, {containerLabel}, or {batchLabel} selected does not allow you to clone."
            values={{
              shipmentLabel: <ShipmentLabelIcon />,
              containerLabel: <ContainerLabelIcon />,
              batchLabel: <BatchLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.actions.tryAgain"
            defaultMessage="Please reselect and try again."
          />
        );
      } else if (isProcessing) {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.cloningShipments"
            defaultMessage="Cloning {numOfShipments} {shipmentsLabel} ..."
            values={{
              numOfShipments,
              shipmentsLabel: totalShipments > 1 ? <ShipmentsLabelIcon /> : <ShipmentLabelIcon />,
            }}
          />
        );
      } else {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.shipmentMessage1"
            defaultMessage="Are you sure you want to clone {numOfShipments} {shipmentsLabel} that you have selected?"
            values={{
              numOfShipments,
              shipmentsLabel: totalShipments > 1 ? <ShipmentsLabelIcon /> : <ShipmentLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.shipmentMessage2"
            defaultMessage="Any selected {containersLabel} or {batchesLabel} will also be cloned within the cloned {shipmentsLabel}"
            values={{
              containersLabel: <ContainersLabelIcon />,
              batchesLabel: <BatchesLabelIcon />,
              shipmentsLabel: totalShipments > 1 ? <ShipmentsLabelIcon /> : <ShipmentLabelIcon />,
            }}
          />
        );
      }
      break;
    case CONTAINER:
      if (noPermission) {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.noContainerPermission"
            defaultMessage="At least one {containerLabel}, or {batchLabel} selected does not allow you to clone."
            values={{
              containerLabel: <ContainerLabelIcon />,
              batchLabel: <BatchLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.actions.tryAgain"
            defaultMessage="Please reselect and try again."
          />
        );
      } else if (isProcessing) {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.cloningContainers"
            defaultMessage="Cloning {numOfContainers} {containersLabel} ..."
            values={{
              numOfContainers,
              containersLabel:
                totalContainers > 1 ? <ContainersLabelIcon /> : <ContainerLabelIcon />,
            }}
          />
        );
      } else {
        dialogMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.containerMessage1"
            defaultMessage="Are you sure you want to clone {numOfContainers} {containersLabel} that you have selected?"
            values={{
              numOfContainers,
              containersLabel:
                totalContainers > 1 ? <ContainersLabelIcon /> : <ContainerLabelIcon />,
            }}
          />
        );
        dialogSubMessage = (
          <FormattedMessage
            id="modules.RelationMap.clone.containerMessage2"
            defaultMessage="Any selected {batchesLabel} will also be cloned within the cloned {containersLabel}"
            values={{
              batchesLabel: <BatchesLabelIcon />,
              containersLabel:
                totalContainers > 1 ? <ContainersLabelIcon /> : <ContainerLabelIcon />,
            }}
          />
        );
      }
      break;
    default:
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.clone.noPermission"
          defaultMessage="You are not allowed to clone."
        />
      );
      break;
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.clone" defaultMessage="CLONE" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage id="modules.RelationMap.label.clone" defaultMessage="CLONE" />}
          icon="CLONE"
          disabled={isProcessing || noPermission}
          onClick={onConfirm}
        />
      }
    />
  );
}
