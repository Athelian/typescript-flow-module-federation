// @flow

function actionCreators(dispatch: Function) {
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

export { actionCreators };
export default actionCreators;
