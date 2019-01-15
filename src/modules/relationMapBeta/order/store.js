// @flow
import logger from 'utils/logger';

export type UIState = {
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
  targets: Array<{
    type: string,
    selectedId: string,
  }>,
  totalShipment: number,
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
  targets: [],
  totalShipment: 0,
};

export function uiReducer(state: UIState, action: { type: string, payload?: Object }) {
  logger.warn({ action, state });
  switch (action.type) {
    case 'RESET':
      return uiInitState;
    case 'TOGGLE_TAG':
      return { ...state, showTag: !state.showTag };
    case 'TOGGLE_SELECT_ALL': {
      const { payload } = action;
      const {
        select: { entities },
      } = state;
      if (payload) {
        if (payload.entity && state.select.entities.includes(payload.entity)) {
          return {
            ...state,
            select: {
              ...state.select,
              entities: (entities.filter(item => item !== payload.entity): Array<string>),
            },
          };
        }
        return {
          ...state,
          select: {
            mode: 'ALL',
            entities: [...entities, payload.entity || ''],
          },
        };
      }
      return state;
    }
    case 'TARGET_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.find(item => item.selectedId === payload.id && item.type === payload.entity)) {
          return {
            ...state,
            targets: (targets.filter(
              item => item.type !== payload.entity && item.selectedId !== payload.id
            ): Array<{
              type: string,
              selectedId: string,
            }>),
          };
        }
        return {
          ...state,
          targets: [
            ...targets,
            {
              type: payload.entity || '',
              selectedId: payload.id || '',
            },
          ],
        };
      }
      return state;
    }
    case 'TOGGLE_SHIPMENT_LIST':
      return { ...state, totalShipment: 0, toggleShipmentList: !state.toggleShipmentList };
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
    toggleSelectAll: (entity: string) =>
      dispatch({
        type: 'TOGGLE_SELECT_ALL',
        payload: {
          entity,
        },
      }),
    countShipment: (total: number) =>
      dispatch({
        type: 'TOTAL_SHIPMENT',
        payload: {
          total,
        },
      }),
    showEditForm: (entity: string, id: string) =>
      dispatch({
        type: 'SHOW_EDIT_FORM',
        payload: {
          entity,
          id,
        },
      }),
    selectBranch: (entity: string, id: string) =>
      dispatch({
        type: 'SELECT_BRANCH',
        payload: {
          entity,
          id,
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
  };
}

const entitySelector = (state: UIState, entity: string) =>
  state.select.mode === 'ALL' && state.select.entities.includes(entity);

export function selectors(state: UIState) {
  return {
    isSelectEntity: (entity: string) => entitySelector(state, entity),
    isTarget: (entity: string, id: string) =>
      state.targets.find(item => item.selectedId === id && item.type === entity),
  };
}
