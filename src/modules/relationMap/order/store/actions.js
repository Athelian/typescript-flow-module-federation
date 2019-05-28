// @flow

function actionCreators(dispatch: (action: { type: string, payload: Object }) => void) {
  return {
    reset: () =>
      dispatch({
        type: 'RESET',
        payload: {},
      }),
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
        payload: {},
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
        payload: {},
      }),
    toggleSelectAll: (entity: string, selectedIds: Array<string>) =>
      dispatch({
        type: 'TOGGLE_SELECT_ALL',
        payload: {
          entity,
          selectedIds,
        },
      }),
    countShipment: (total: number, shipments: Array<Object>) =>
      dispatch({
        type: 'TOTAL_SHIPMENT',
        payload: {
          total,
          shipments,
        },
      }),
    showEditForm: (type: string, selectedId: string, extra: Object = {}) =>
      dispatch({
        type: 'TOGGLE_EDIT_FORM',
        payload: {
          type,
          selectedId,
          extra,
        },
      }),
    selectBranch: (selectItems: Array<{ entity: string, id: string, exporterId: string }>) =>
      dispatch({
        type: 'SELECT_BRANCH',
        payload: {
          selectItems,
        },
      }),
    targetNewEntities: (selectItems: Array<{ entity: string, id: string, exporterId: string }>) =>
      dispatch({
        type: 'TARGET_NEW_ENTITY',
        payload: {
          selectItems,
        },
      }),
    targetShipmentEntity: (id: string, no: string) =>
      dispatch({
        type: 'TARGET_SHIPMENT_ENTITY',
        payload: {
          id,
          no,
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
    cloneEntities: (entities: Array<Object>) =>
      dispatch({
        type: 'CLONE_ENTITIES',
        payload: {
          entities,
        },
      }),
    cloneEntitiesSuccess: (data: Array<{ type: string, items: Object }>) =>
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
    moveToOrder: (targetOrder: Object) =>
      dispatch({
        type: 'MOVE_TO_ORDER',
        payload: {
          targetOrder,
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
    moveToShipment: (batchIds: Array<string>, shipmentIds: Array<string>) =>
      dispatch({
        type: 'MOVE_TO_SHIPMENT',
        payload: {
          batchIds,
          shipmentIds,
        },
      }),
    moveToNewShipment: (batchIds: Array<string>, shipmentIds: Array<string>) =>
      dispatch({
        type: 'MOVE_TO_NEW_SHIPMENT',
        payload: {
          batchIds,
          shipmentIds,
        },
      }),
    moveToShipmentSuccess: (data: Object) =>
      dispatch({
        type: 'MOVE_TO_SHIPMENT_SUCCESS',
        payload: {
          data,
        },
      }),
    moveToShipmentFailed: (error: string) =>
      dispatch({
        type: 'MOVE_TO_SHIPMENT_ERROR',
        payload: {
          error,
        },
      }),
    disconnectShipment: (batchIds: Array<string>) =>
      dispatch({
        type: 'DISCONNECT_SHIPMENT',
        payload: {
          batchIds,
        },
      }),
    disconnectShipmentSuccess: (data: Object) =>
      dispatch({
        type: 'DISCONNECT_SHIPMENT_SUCCESS',
        payload: {
          data,
        },
      }),
    disconnectShipmentFailed: (error: string) =>
      dispatch({
        type: 'DISCONNECT_SHIPMENT_ERROR',
        payload: {
          error,
        },
      }),
    changeSelectMode: (entity: '' | 'ORDER' | 'SHIPMENT') =>
      dispatch({
        type: 'CHANGE_SELECT_MODE',
        payload: {
          entity,
        },
      }),
    toggleSelectedOrder: (id: string) =>
      dispatch({
        type: 'TOGGLE_SELECTED_ORDER',
        payload: {
          id,
        },
      }),
    toggleSelectedShipment: (id: string) =>
      dispatch({
        type: 'TOGGLE_SELECTED_SHIPMENT',
        payload: {
          id,
        },
      }),
    addNew: (entity: 'ORDER' | 'SHIPMENT', id: string) =>
      dispatch({
        type: 'NEW_ENTITY',
        payload: {
          id,
          entity,
        },
      }),
    refetchQueryBy: (entity: string, ids: Array<string>) =>
      dispatch({
        type: 'REFETCH_BY',
        payload: {
          entity,
          ids,
        },
      }),
    clearConnectMessage: () =>
      dispatch({
        type: 'CLEAR_CONNECT_MESSAGE',
        payload: {},
      }),
    prepareRemoveOrderItemsAndBatches: (
      updateOrdersInput: Array<{ id: string, orderItems: Array<Object> }>
    ) =>
      dispatch({
        type: 'PREPARE_REMOVE_DATA',
        payload: {
          updateOrdersInput,
        },
      }),
    removeEntitiesSuccess: () =>
      dispatch({
        type: 'REMOTE_ENTITIES_SUCCESS',
        payload: {},
      }),
    removeEntitiesFailed: (error: Object) =>
      dispatch({
        type: 'REMOTE_ENTITIES_ERROR',
        payload: {
          error,
        },
      }),
    setRefetchAll: (isEnable: boolean) =>
      dispatch({
        type: 'REFETCH_ALL',
        payload: {
          isEnable,
        },
      }),
    scrollToShipment: (id: string) =>
      dispatch({
        type: 'SCROLL_TO_SHIPMENT',
        payload: {
          id,
        },
      }),
  };
}

export { actionCreators };
export default actionCreators;
