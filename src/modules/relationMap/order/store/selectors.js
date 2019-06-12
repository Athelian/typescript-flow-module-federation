// @flow
import { uniq, intersection } from 'lodash';
import { SHIPMENT, BATCH, ORDER_ITEM, ORDER } from 'constants/keywords';
import type { UIState } from './type.js.flow';

const entitySelector = ({
  state,
  entity,
  total,
}: {
  state: UIState,
  entity: string,
  total: number,
}) =>
  state.select.mode === 'ALL' &&
  state.select.entities.includes(entity) &&
  total === state.targets.filter(item => item.includes(`${entity}-`)).length;

const targetedIds = (state: UIState, type: BATCH | SHIPMENT | ORDER | ORDER_ITEM) => {
  const ids = state.targets.filter(item => item.includes(`${type}-`));
  return (ids.map(orderItem => {
    const [, id] = orderItem.split('-');
    return id;
  }): Array<string>);
};

const currentExporterId = (state: UIState) => {
  const result = [];

  state.constraint.exporterIds.forEach(item => {
    const [, exporterId] = item.split('-');
    if (!result.includes(exporterId)) {
      result.push(exporterId);
    }
  });

  if (result.length === 1) return result[0];

  return '';
};

const isAllowToConnectOrder = (state: UIState) => {
  if (
    state.targets.filter(item => item.includes(`${ORDER}-`)).length > 0 ||
    state.targets.filter(item => item.includes(`${SHIPMENT}-`)).length > 0
  )
    return false;

  const batchIds = targetedIds(state, BATCH);

  const orderItemIds = targetedIds(state, ORDER_ITEM);

  const exporterId = currentExporterId(state);

  return exporterId !== '' && (batchIds.length || orderItemIds.length);
};

const isAllowToSelectOrder = ({ exporterId, state }: { exporterId: string, state: UIState }) =>
  currentExporterId(state) === exporterId && state.connectOrder.enableSelectMode;

const hasSelectedAllBatches = ({
  state,
  orderItems = {},
}: {
  state: UIState,
  orderItems: Object,
}) => {
  const batchIds = targetedIds(state, BATCH);
  const orderItemIds = targetedIds(state, ORDER_ITEM);
  const allBatchIds = [];
  orderItemIds.forEach(orderItemId => {
    const { batches = [] } = orderItems[orderItemId] || {};
    batches.forEach(id => {
      if (!allBatchIds.includes(id)) allBatchIds.push(id);
    });
  });

  return batchIds.length === allBatchIds.length && allBatchIds.length > 0;
};

const findAllCurrencies = ({
  state,
  orders,
  orderItems,
}: {
  state: UIState,
  orders: Object,
  orderItems: Object,
}) => {
  const result = [];
  const selectedOrder = orders[state.connectOrder.orderId];
  if (selectedOrder) {
    result.push(selectedOrder.currency);
    const orderItemIds = targetedIds(state, ORDER_ITEM);
    const batchIds = targetedIds(state, BATCH);
    const allOrderItemIds = [...orderItemIds];
    (Object.entries(orderItems || {}): Array<any>).forEach(([orderItemId, orderItem]) => {
      if (
        !allOrderItemIds.includes(orderItemId) &&
        intersection(orderItem.batches, batchIds).length > 0
      ) {
        allOrderItemIds.push(orderItemId);
      }
    });
    allOrderItemIds.forEach(orderItemId => {
      if (orderItems[orderItemId]) {
        const { price = {} } = orderItems[orderItemId];
        if (price.currency && !result.includes(price.currency)) result.push(price.currency);
      }
    });
  }
  return result;
};

function selectors(state: UIState) {
  return {
    isAllowToConnectOrder: () => isAllowToConnectOrder(state),
    isAllowToConnectShipment: () =>
      state.targets.filter(item => item.includes(`${BATCH}-`)).length > 0 &&
      state.targets.filter(item => item.includes(`${SHIPMENT}-`)).length === 0,
    isSelectedOrder: () => state.connectOrder.enableSelectMode && state.connectOrder.orderId !== '',
    isSelectedShipment: () =>
      state.connectShipment.enableSelectMode && state.connectShipment.shipmentId !== '',
    isAllowToSelectOrder: (exporterId: string) => isAllowToSelectOrder({ exporterId, state }),
    isAllowToSplitBatch: () =>
      state.targets.length === 1 &&
      state.targets.filter(item => item.includes(`${BATCH}-`)).length === 1,
    isAllowToAutoFillBatch: () =>
      state.targets.length > 0 &&
      state.targets.filter(item => item.includes(`${ORDER_ITEM}-`)).length > 0,
    isSelectEntity: (highLightEntities: Array<string>, entity: string, id: string) =>
      highLightEntities.includes(`${entity}-${id}`),
    isSelectAllEntity: (entity: string, total: number) => entitySelector({ state, entity, total }),
    isTarget: (entity: string, id: string) => state.targets.includes(`${entity}-${id}`),
    isTargetAnyItem: () => state.targets.length > 0,
    isHighLightAnyItem: () => state.highlight.selectedId !== '',
    countTargetBy: (entity: string) =>
      state.targets.filter(item => item.includes(`${entity}-`)).length,
    countHighLightBy: (highLightEntities: Array<string>, entity: string) =>
      uniq(highLightEntities.filter(item => item.includes(`${entity}-`))).length,
    targetedBatchId: () => {
      const batch = state.targets.find(item => item.includes(`${BATCH}-`));
      if (batch) {
        const [, batchId] = batch.split('-');
        return batchId;
      }
      return '';
    },
    targetedOrderIds: () => targetedIds(state, ORDER),
    targetedOrderItemIds: () => targetedIds(state, ORDER_ITEM),
    targetedBatchIds: () => targetedIds(state, BATCH),
    targetedShipmentIds: () => targetedIds(state, SHIPMENT),
    currentExporterId: () => currentExporterId(state),
    selectedConnectOrder: (id: string) => state.connectOrder.orderId === id,
    selectedConnectShipment: (id: string) => state.connectShipment.shipmentId === id,
    hasSelectedAllBatches: (orderItems: Object) => hasSelectedAllBatches({ state, orderItems }),
    findAllCurrencies: (orders: Object, orderItems: Object) =>
      findAllCurrencies({ state, orders, orderItems }),
    lastNewOrderId: () =>
      state.new.orders.length > 0 ? state.new.orders[state.new.orders.length - 1] : '',
    isNewOrder: (id: string) => state.new.orders.includes(id),
    isNewShipment: (id: string) => state.new.shipments.includes(id),
    shipmentNo: (id: string) => state.clone.shipmentNo[id],
    isDisableCloneOrder: (noPermission: boolean) =>
      noPermission && targetedIds(state, ORDER).length > 0,
  };
}

export { selectors };
export default selectors;
