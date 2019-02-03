// @flow
import { intersection } from 'lodash';
import logger from 'utils/logger';
import { SHIPMENT, BATCH, ORDER_ITEM, ORDER } from 'modules/relationMap/constants';
import { getByPathWithDefault } from 'utils/fp';

export type UIState = {
  loading: boolean,
  error: boolean,
  showTag: boolean,
  refetchOrderId: string,
  refetchShipmentId: string,
  expandCards: {
    orders: Array<string>,
    shipments: Array<string>,
  },
  toggleShipmentList: boolean,
  select: {
    mode: 'SINGLE' | 'ALL',
    entities: Array<string>,
  },
  highlight: {
    type: string,
    selectedId: string,
  },
  edit: {
    type: string,
    selectedId: string,
  },
  new: {
    orders: Array<string>,
  },
  targets: Array<string>,
  totalShipment: number,
  split: {
    parentOrderIds: Array<string>,
    batches: Object,
  },
  balanceSplit: {
    batches: Array<Object>,
  },
  clone: {
    batches: Object,
  },
  connectOrder: {
    enableSelectMode: boolean,
    orderId: string,
    exporterIds: Array<string>,
  },
};

export const getInitShowTag = () => {
  const localFilterRMTags = window.localStorage && window.localStorage.getItem('filterRMTags');
  const initTagValue = localFilterRMTags ? JSON.parse(localFilterRMTags) : { showTag: false };
  return initTagValue.showTag || false;
};

const getInitToggleShipmentList = () => {
  const localFilter = window.localStorage && window.localStorage.getItem('filterRMShipmentToggle');
  const initValue = localFilter ? JSON.parse(localFilter) : { isToggle: false };
  return initValue.isToggle || false;
};

export const uiInitState: UIState = {
  loading: false,
  error: false,
  showTag: getInitShowTag(),
  refetchOrderId: '',
  refetchShipmentId: '',
  expandCards: {
    orders: [],
    shipments: [],
  },
  toggleShipmentList: getInitToggleShipmentList(),
  new: {
    orders: [],
  },
  select: {
    mode: 'SINGLE',
    entities: [],
  },
  highlight: {
    type: '',
    selectedId: '',
  },
  edit: {
    type: '',
    selectedId: '',
  },
  targets: [],
  totalShipment: 0,
  split: {
    parentOrderIds: [],
    batches: {},
  },
  balanceSplit: {
    batches: [],
  },
  clone: {
    batches: {},
  },
  connectOrder: {
    enableSelectMode: false,
    orderId: '',
    exporterIds: [],
  },
};

export function uiReducer(state: UIState, action: { type: string, payload?: Object }) {
  logger.warn({ action, state });
  switch (action.type) {
    case 'RESET':
      return uiInitState;
    case 'CLEAR_ERROR_MESSAGE':
      return {
        ...state,
        loading: false,
        error: false,
      };
    case 'ENABLE_SELECT_ORDER':
      return {
        ...state,
        connectOrder: {
          ...state.connectOrder,
          enableSelectMode: !!getByPathWithDefault(false, 'payload.isEnable', action),
        },
      };
    case 'NEW_ORDER': {
      const orderId = getByPathWithDefault('', 'payload.id', action);
      return {
        ...state,
        new: {
          ...state.new,
          orders: [...state.new.orders, orderId],
        },
      };
    }
    case 'TOGGLE_SELECTED_ORDER': {
      const orderId = getByPathWithDefault('', 'payload.id', action);
      return {
        ...state,
        connectOrder: {
          ...state.connectOrder,
          orderId: orderId === state.connectOrder.orderId ? '' : orderId,
        },
      };
    }
    case 'REFETCH_BY': {
      const id = getByPathWithDefault('', 'payload.id', action);
      const entity = getByPathWithDefault('', 'payload.entity', action);
      const updateData = {};
      if (entity === 'ORDER') {
        updateData.refetchOrderId = id;
      } else {
        updateData.refetchShipmentId = id;
      }
      return {
        ...state,
        ...updateData,
      };
    }
    case 'SPLIT_BATCH':
    case 'AUTO_FILL_BATCHES':
    case 'CLONE_ENTITIES':
    case 'MOVE_TO_ORDER':
      return {
        ...state,
        loading: true,
      };
    case 'SPLIT_BATCH_ERROR':
    case 'AUTO_FILL_BATCHES_ERROR':
    case 'CLONE_ENTITIES_ERROR':
    case 'MOVE_TO_ORDER_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };
    case 'MOVE_TO_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        connectOrder: {
          ...state.connectOrder,
          orderId: '',
        },
        targets:
          state.connectOrder.orderId !== '' ? [`${ORDER}-${state.connectOrder.orderId}`] : [],
      };
    case 'SPLIT_BATCH_SUCCESS': {
      const batchId = getByPathWithDefault('', 'payload.batchId', action);
      const [, orderId] = (
        state.split.parentOrderIds.find(item => item.includes(`${batchId}-`)) || ''
      ).split('-');
      const { batches } = state.split;
      return {
        ...state,
        split: {
          batches: {
            ...batches,
            [batchId]: state.split.batches[batchId]
              ? [
                  ...state.split.batches[batchId],
                  ...getByPathWithDefault([], 'payload.data.batches', action).filter(
                    item => item && item.id !== batchId
                  ),
                ]
              : getByPathWithDefault([], 'payload.data.batches', action).filter(
                  item => item && item.id !== batchId
                ),
          },
          parentOrderIds: getByPathWithDefault([], 'payload.data.batches', action)
            .filter(item => item && item.id !== batchId)
            .map(batch => `${batch.id}-${orderId}`),
        },
        targets: getByPathWithDefault([], 'payload.data.batches', action)
          .filter(item => item && item.id !== batchId)
          .map(batch => `${BATCH}-${batch.id}`),
        loading: false,
        error: false,
      };
    }
    case 'AUTO_FILL_BATCHES_SUCCESS': {
      const batches = getByPathWithDefault([], 'payload.data', action).reduce(
        (result, currentItem) => result.concat(currentItem.batches),
        []
      );
      return {
        ...state,
        balanceSplit: {
          batches: [...state.balanceSplit.batches, ...batches],
        },
        targets: batches.map(({ id }) => `${BATCH}-${id}`),
        loading: false,
        error: false,
      };
    }
    case 'CLONE_ENTITIES_SUCCESS': {
      const { batches } = state.clone;
      getByPathWithDefault([], 'payload.data', action).forEach(({ id, batch }) => {
        batches[id] = batches[id] ? [...batches[id], batch] : [batch];
      });

      return {
        ...state,
        clone: {
          batches,
        },
        targets: getByPathWithDefault([], 'payload.data', action).map(
          ({ batch }) => `${BATCH}-${batch.id}`
        ),
        loading: false,
        error: false,
      };
    }
    case 'CLEAR_ALL': {
      const { payload } = action;
      if (payload && payload.mode === 'TARGET') {
        return {
          ...state,
          targets: [],
          connectOrder: {
            enableSelectMode: false,
            orderId: '',
            exporterIds: [],
          },
          select: {
            mode: 'SINGLE',
            entities: [],
          },
        };
      }
      return {
        ...state,
        highlight: {
          type: '',
          selectedId: '',
        },
      };
    }
    case 'TOGGLE_TAG':
      return { ...state, showTag: !state.showTag };
    case 'TOGGLE_EDIT_FORM':
      return { ...state, edit: action.payload };
    case 'TOGGLE_SELECT_ALL': {
      // TODO: Need to check target all action for split and move to order
      const { payload } = action;
      const {
        select: { entities },
        targets,
      } = state;
      let result = [...targets];
      if (payload && payload.entity && payload.selectedIds) {
        const { selectedIds, entity } = payload;
        if (
          state.select.entities.includes(entity) &&
          state.targets.filter(item => item.includes(`${entity}-`)).length === selectedIds.length
        ) {
          return {
            ...state,
            targets: (result.filter(
              targetItem => !targetItem.includes(`${entity}-`)
            ): Array<string>),
            select: {
              ...state.select,
              entities: (entities.filter(item => item !== payload.entity): Array<string>),
            },
          };
        }
        selectedIds.forEach(selectItemId => {
          if (!result.includes(`${entity}-${selectItemId}`))
            result = [...result, `${entity}-${selectItemId}`];
        });
        return {
          ...state,
          targets: result,
          select: {
            mode: 'ALL',
            entities: [...entities, payload.entity || ''],
          },
        };
      }
      return state;
    }
    case 'SELECT_BRANCH': {
      // TODO: Need to check target all action for split and move to order
      const { payload } = action;
      const {
        targets,
        connectOrder: { exporterIds },
      } = state;
      let result = [...targets];
      let exporters = [...exporterIds];
      if (payload) {
        const { selectItems } = payload;
        if (
          selectItems.every(selectItem => result.includes(`${selectItem.entity}-${selectItem.id}`))
        ) {
          selectItems.forEach(selectItem => {
            result = (result.filter(
              item => item !== `${selectItem.entity}-${selectItem.id}`
            ): Array<string>);
            exporters = (exporterIds.filter(item => item !== selectItem.exporterId): Array<string>);
          });
        } else {
          selectItems.forEach(selectItem => {
            if (!result.includes(`${selectItem.entity}-${selectItem.id}`))
              result = [...result, `${selectItem.entity}-${selectItem.id}`];
            if (!exporterIds.includes(selectItem.exporterId))
              exporters = [...exporterIds, selectItem.exporterId];
          });
        }
      }
      return {
        ...state,
        connectOrder: {
          ...state.connectOrder,
          exporterIds: exporters,
        },
        targets: result,
      };
    }
    case 'TARGET_SHIPMENT_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${SHIPMENT}-${payload.id}`)) {
          return {
            ...state,
            targets: (targets.filter(item => item !== `${SHIPMENT}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          targets: [...targets, `${SHIPMENT}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_ORDER_ITEM_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${ORDER_ITEM}-${payload.id}`)) {
          return {
            ...state,
            connectOrder: {
              ...state.connectOrder,
              exporterIds: state.connectOrder.exporterIds.includes(payload.exporterId)
                ? state.connectOrder.exporterIds
                : [...state.connectOrder.exporterIds, payload.exporterId],
            },
            targets: (targets.filter(
              item => item !== `${ORDER_ITEM}-${payload.id}`
            ): Array<string>),
          };
        }
        return {
          ...state,
          connectOrder: {
            ...state.connectOrder,
            exporterIds: state.connectOrder.exporterIds.includes(payload.exporterId)
              ? state.connectOrder.exporterIds
              : [...state.connectOrder.exporterIds, payload.exporterId],
          },
          targets: [...targets, `${ORDER_ITEM}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_ORDER_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${ORDER}-${payload.id}`)) {
          return {
            ...state,
            targets: (targets.filter(item => item !== `${ORDER}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          targets: [...targets, `${ORDER}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_BATCH_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${BATCH}-${payload.id}`)) {
          return {
            ...state,
            split: {
              ...state.split,
              parentOrderIds: state.split.parentOrderIds.includes(
                `${payload.id}-${payload.parentOrderId}`
              )
                ? state.split.parentOrderIds
                : [...state.split.parentOrderIds, `${payload.id}-${payload.parentOrderId}`],
            },
            connectOrder: {
              ...state.connectOrder,
              exporterIds: state.connectOrder.exporterIds.includes(payload.exporterId)
                ? state.connectOrder.exporterIds
                : [...state.connectOrder.exporterIds, payload.exporterId],
            },
            targets: (targets.filter(item => item !== `${BATCH}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          split: {
            ...state.split,
            parentOrderIds: state.split.parentOrderIds.includes(
              `${payload.id}-${payload.parentOrderId}`
            )
              ? state.split.parentOrderIds
              : [...state.split.parentOrderIds, `${payload.id}-${payload.parentOrderId}`],
          },
          connectOrder: {
            ...state.connectOrder,
            exporterIds: state.connectOrder.exporterIds.includes(payload.exporterId)
              ? state.connectOrder.exporterIds
              : [...state.connectOrder.exporterIds, payload.exporterId],
          },
          targets: [...targets, `${BATCH}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TOGGLE_SHIPMENT_LIST':
      return {
        ...state,
        totalShipment: 0,
        toggleShipmentList: !state.toggleShipmentList,
        targets: (state.targets.filter(item => !item.includes(`${SHIPMENT}-`)): Array<string>),
      };
    case 'TOTAL_SHIPMENT': {
      const { payload } = action;
      const total = payload && payload.total ? payload.total : 0;
      return { ...state, totalShipment: total };
    }
    case 'TOGGLE_HIGH_LIGHT': {
      const { payload } = action;
      if (payload) {
        const { entity, id } = payload;
        if (state.highlight.type === entity && state.highlight.selectedId === id) {
          return {
            ...state,
            highlight: {
              type: '',
              selectedId: '',
            },
          };
        }
        return {
          ...state,
          highlight: {
            type: entity,
            selectedId: id,
          },
        };
      }
      return state;
    }
    case 'TOGGLE_EXPAND': {
      const { payload } = action;
      if (payload) {
        let field = 'orders';
        if (payload && payload.entity && payload.entity === 'SHIPMENT') {
          field = 'shipments';
        }
        return {
          ...state,
          expandCards: {
            ...state.expandCards,
            [field]: state.expandCards[field].includes(payload.id)
              ? (state.expandCards[field].filter(id => id !== payload.id): Array<string>)
              : [...state.expandCards[field], payload.id || ''],
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
}

export function actionCreators(dispatch: Function) {
  return {
    clearAllBy: (mode: 'TARGET' | 'HIGHLIGHT') =>
      dispatch({
        type: 'CLEAR_ALL',
        payload: {
          mode,
        },
      }),
    clearErrorMessage: () =>
      dispatch({
        type: 'CLEAR_ERROR_MESSAGE',
        payload: {},
      }),
    toggleTag: () =>
      dispatch({
        type: 'TOGGLE_TAG',
      }),
    toggleExpand: (entity: string, id: string) =>
      dispatch({
        type: 'TOGGLE_EXPAND',
        payload: {
          entity,
          id,
        },
      }),
    toggleHighLight: (entity: string, id: string) =>
      dispatch({
        type: 'TOGGLE_HIGH_LIGHT',
        payload: {
          entity,
          id,
        },
      }),
    toggleShipmentList: () =>
      dispatch({
        type: 'TOGGLE_SHIPMENT_LIST',
      }),
    toggleSelectAll: (entity: string, selectedIds: Array<string>) =>
      dispatch({
        type: 'TOGGLE_SELECT_ALL',
        payload: {
          entity,
          selectedIds,
        },
      }),
    countShipment: (total: number) =>
      dispatch({
        type: 'TOTAL_SHIPMENT',
        payload: {
          total,
        },
      }),
    showEditForm: (type: string, selectedId: string) =>
      dispatch({
        type: 'TOGGLE_EDIT_FORM',
        payload: {
          type,
          selectedId,
        },
      }),
    selectBranch: (selectItems: Array<{ entity: string, id: string, exporterId: string }>) =>
      dispatch({
        type: 'SELECT_BRANCH',
        payload: {
          selectItems,
        },
      }),
    targetShipmentEntity: (id: string) =>
      dispatch({
        type: 'TARGET_SHIPMENT_ENTITY',
        payload: {
          id,
        },
      }),
    targetOrderEntity: (id: string, exporterId: string) =>
      dispatch({
        type: 'TARGET_ORDER_ENTITY',
        payload: {
          exporterId,
          id,
        },
      }),
    targetOrderItemEntity: (id: string, exporterId: string) =>
      dispatch({
        type: 'TARGET_ORDER_ITEM_ENTITY',
        payload: {
          exporterId,
          id,
        },
      }),
    targetBatchEntity: ({
      id,
      parentOrderId,
      exporterId,
    }: {
      id: string,
      parentOrderId: string,
      exporterId: string,
    }) =>
      dispatch({
        type: 'TARGET_BATCH_ENTITY',
        payload: {
          parentOrderId,
          exporterId,
          id,
        },
      }),
    splitBatch: ({
      type,
      batchId,
      quantity,
    }: {
      type: string,
      batchId: string,
      quantity: number,
    }) =>
      dispatch({
        type: 'SPLIT_BATCH',
        payload: {
          type,
          batchId,
          quantity,
        },
      }),
    splitBatchSuccess: (batchId: string, data: Object) =>
      dispatch({
        type: 'SPLIT_BATCH_SUCCESS',
        payload: {
          batchId,
          data,
        },
      }),
    splitBatchFailed: (error: string) =>
      dispatch({
        type: 'SPLIT_BATCH_ERROR',
        payload: {
          error,
        },
      }),
    autoFillBatches: (orderItemIds: Array<string>) =>
      dispatch({
        type: 'AUTO_FILL_BATCHES',
        payload: {
          orderItemIds,
        },
      }),
    autoFillBatchesSuccess: (data: Object) =>
      dispatch({
        type: 'AUTO_FILL_BATCHES_SUCCESS',
        payload: {
          data,
        },
      }),
    autoFillBatchesFailed: (error: string) =>
      dispatch({
        type: 'AUTO_FILL_BATCHES_ERROR',
        payload: {
          error,
        },
      }),
    cloneEntities: (entities: Object) =>
      dispatch({
        type: 'CLONE_ENTITIES',
        payload: {
          entities,
        },
      }),
    cloneEntitiesSuccess: (data: Object) =>
      dispatch({
        type: 'CLONE_ENTITIES_SUCCESS',
        payload: {
          data,
        },
      }),
    cloneEntitiesFailed: (error: string) =>
      dispatch({
        type: 'CLONE_ENTITIES_ERROR',
        payload: {
          error,
        },
      }),
    moveToOrder: (entities: Object) =>
      dispatch({
        type: 'MOVE_TO_ORDER',
        payload: {
          entities,
        },
      }),
    moveToOrderSuccess: (data: Object) =>
      dispatch({
        type: 'MOVE_TO_ORDER_SUCCESS',
        payload: {
          data,
        },
      }),
    moveToOrderFailed: (error: string) =>
      dispatch({
        type: 'MOVE_TO_ORDER_ERROR',
        payload: {
          error,
        },
      }),
    selectOrderMode: (isEnable: boolean) =>
      dispatch({
        type: 'ENABLE_SELECT_ORDER',
        payload: {
          isEnable,
        },
      }),
    toggleSelectedOrder: (id: string) =>
      dispatch({
        type: 'TOGGLE_SELECTED_ORDER',
        payload: {
          id,
        },
      }),
    adddNewOrder: (id: string) =>
      dispatch({
        type: 'NEW_ORDER',
        payload: {
          id,
        },
      }),
    refetchQueryBy: (entity: string, id: string) =>
      dispatch({
        type: 'REFETCH_BY',
        payload: {
          entity,
          id,
        },
      }),
  };
}

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
  currentExporterId(state) === exporterId;

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

export function selectors(state: UIState) {
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
