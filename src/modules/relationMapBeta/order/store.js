// @flow
import logger from 'utils/logger';
import { SHIPMENT, BATCH } from 'modules/relationMap/constants';
import { getByPathWithDefault } from 'utils/fp';

export type UIState = {
  loading: boolean,
  error: boolean,
  showTag: boolean,
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
  targets: Array<string>,
  totalShipment: number,
  split: {
    parentOrderIds: Array<string>,
    batches: Object,
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
  expandCards: {
    orders: [],
    shipments: [],
  },
  toggleShipmentList: getInitToggleShipmentList(),
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
};

export function uiReducer(state: UIState, action: { type: string, payload?: Object }) {
  logger.warn({ action, state });
  switch (action.type) {
    case 'RESET':
      return uiInitState;
    case 'SPLIT_BATCH':
      return {
        ...state,
        loading: true,
      };
    case 'SPLIT_BATCH_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
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
    case 'CLEAR_ALL': {
      const { payload } = action;
      if (payload && payload.mode === 'TARGET') {
        return {
          ...state,
          targets: [],
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
      const { payload } = action;
      const { targets } = state;
      let result = [...targets];
      if (payload) {
        const { selectItems } = payload;
        if (
          selectItems.every(selectItem => result.includes(`${selectItem.entity}-${selectItem.id}`))
        ) {
          selectItems.forEach(selectItem => {
            result = (result.filter(
              item => item !== `${selectItem.entity}-${selectItem.id}`
            ): Array<string>);
          });
        } else {
          selectItems.forEach(selectItem => {
            if (!result.includes(`${selectItem.entity}-${selectItem.id}`))
              result = [...result, `${selectItem.entity}-${selectItem.id}`];
          });
        }
      }
      return {
        ...state,
        targets: result,
      };
    }
    case 'TARGET_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${payload.entity}-${payload.id}`)) {
          return {
            ...state,
            targets: (targets.filter(
              item => item !== `${payload.entity}-${payload.id}`
            ): Array<string>),
          };
        }
        return {
          ...state,
          targets: [...targets, `${payload.entity}-${payload.id}`],
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
              parentOrderIds: [
                ...state.split.parentOrderIds,
                `${payload.id}-${payload.parentOrderId}`,
              ],
            },
            targets: (targets.filter(item => item !== `${BATCH}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          split: {
            ...state.split,
            parentOrderIds: [
              ...state.split.parentOrderIds,
              `${payload.id}-${payload.parentOrderId}`,
            ],
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
    selectBranch: (selectItems: Array<{ entity: string, id: string }>) =>
      dispatch({
        type: 'SELECT_BRANCH',
        payload: {
          selectItems,
        },
      }),
    targetEntity: (entity: string, id: string) =>
      dispatch({
        type: 'TARGET_ENTITY',
        payload: {
          entity,
          id,
        },
      }),
    targetBatchEntity: (id: string, parentOrderId: string) =>
      dispatch({
        type: 'TARGET_BATCH_ENTITY',
        payload: {
          parentOrderId,
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

export function selectors(state: UIState) {
  return {
    isAllowToSplitBatch: () =>
      state.targets.length === 1 &&
      state.targets.filter(item => item.includes(`${BATCH}-`)).length === 1,
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
  };
}
