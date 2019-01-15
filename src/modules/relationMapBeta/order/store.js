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
  console.log('localFilter', localFilter, initValue);
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
      if (payload && payload.entity && state.select.entities.includes(payload.entity)) {
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
          entities: [...entities, payload && payload.entity ? payload.entity : ''],
        },
      };
    }
    case 'TOGGLE_SHIPMENT_LIST':
      return { ...state, totalShipment: 0, toggleShipmentList: !state.toggleShipmentList };
    case 'TOTAL_SHIPMENT': {
      const { payload } = action;
      const total = payload && payload.total ? payload.total : 0;
      return { ...state, totalShipment: total };
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
              : [...state.expandCards[field], payload && payload.id ? payload.id : ''],
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
  };
}

const entitySelector = (state: UIState, entity: string) =>
  state.select.mode === 'ALL' && state.select.entities.includes(entity);

export function selectors(state: UIState) {
  return {
    isSelectEntity: (entity: string) => entitySelector(state, entity),
  };
}
