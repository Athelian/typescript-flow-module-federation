// @flow
import { intersection } from 'lodash';
import { SHIPMENT, BATCH, ORDER_ITEM, ORDER } from 'modules/relationMap/constants';
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

const targetedOrderItemIds = (state: UIState) => {
  const orderItems = state.targets.filter(item => item.includes(`${ORDER_ITEM}-`));
  return (orderItems.map(orderItem => {
    const [, orderItemId] = orderItem.split('-');
    return orderItemId;
  }): Array<string>);
};

function targetedBatchIds(state: UIState) {
  const batches = state.targets.filter(item => item.includes(`${BATCH}-`));
  return (batches.map(orderItem => {
    const [, batchId] = orderItem.split('-');
    return batchId;
  }): Array<string>);
}

const currentExporterId = (state: UIState) => {
  const result = [];

  state.connectOrder.exporterIds.forEach(item => {
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

  const batchIds = targetedBatchIds(state);

  const orderItemIds = targetedOrderItemIds(state);

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
  const batchIds = targetedBatchIds(state);
  const orderItemIds = targetedOrderItemIds(state);
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
    const orderItemIds = targetedOrderItemIds(state);
    const batchIds = targetedBatchIds(state);
    const allOrderItemIds = [...orderItemIds];
    (Object.entries(orderItems): Array<any>).forEach(([orderItemId, orderItem]) => {
      if (
        !allOrderItemIds.includes(orderItemId) &&
        intersection(orderItem.batches, batchIds).length > 0
      ) {
        allOrderItemIds.push(orderItemId);
      }
    });
    allOrderItemIds.forEach(orderItemId => {
      if (orderItems[orderItemId]) {
        const { price } = orderItems[orderItemId];
        if (!result.includes(price.currency)) result.push(price.currency);
      }
    });
  }
  return result;
};

function selectors(state: UIState) {
  return {
    isAllowToConnectOrder: () => isAllowToConnectOrder(state),
    isSelectedOrder: () => state.connectOrder.enableSelectMode && state.connectOrder.orderId !== '',
    isAllowToSelectOrder: (exporterId: string) => isAllowToSelectOrder({ exporterId, state }),
    isAllowToConnectShipment: () => false,
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
      highLightEntities.filter(item => item.includes(`${entity}-`)).length,
    targetedBatchId: () => {
      const batch = state.targets.find(item => item.includes(`${BATCH}-`));
      if (batch) {
        const [, batchId] = batch.split('-');
        return batchId;
      }
      return '';
    },
    targetedOrderItemIds: () => targetedOrderItemIds(state),
    targetedBatchIds: () => targetedBatchIds(state),
    currentExporterId: () => currentExporterId(state),
    selectedConnectOrder: (id: string) => state.connectOrder.orderId === id,
    hasSelectedAllBatches: (orderItems: Object) => hasSelectedAllBatches({ state, orderItems }),
    findAllCurrencies: (orders: Object, orderItems: Object) =>
      findAllCurrencies({ state, orders, orderItems }),
    lastNewOrderId: () =>
      state.new.orders.length > 0 ? state.new.orders[state.new.orders.length - 1] : '',
    isNewOrder: (id: string) => state.new.orders.includes(id),
  };
}

export { selectors };
export default selectors;
