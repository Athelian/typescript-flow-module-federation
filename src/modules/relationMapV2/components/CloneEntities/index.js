// @flow
import * as React from 'react';
import { findKey, flattenDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH } from 'modules/relationMapV2/constants';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ActionDialog, {
  OrdersLabelIcon,
  OrderLabelIcon,
  ItemsLabelIcon,
  ItemLabelIcon,
  BatchesLabelIcon,
  BatchLabelIcon,
} from '../ActionDialog';
import { cloneBatchesMutation, cloneOrderItemsMutation, cloneOrdersMutation } from './mutation';
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

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER:
        return hasOrderPermissions(permission);
      case ORDER_ITEM:
        return hasItemPermissions(permission);
      case BATCH:
        return hasBatchPermissions(permission);
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

  let dialogMessage = null;
  let dialogSubMessage = null;

  const numOfOrders = <FormattedNumber value={totalOrders} />;
  const numOfItems = <FormattedNumber value={totalOrderItems} />;
  const numOfBatches = <FormattedNumber value={totalBatches} />;

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
