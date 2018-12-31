// @flow

export type UIState = {
  showTag: boolean,
  toggleShipmentList: boolean,
  select: {
    mode: 'SINGLE' | 'ALL',
    entities: Array<string>,
  },
  totalShipment: number,
};

export const uiInitState: UIState = {
  showTag: false,
  toggleShipmentList: false,
  select: {
    mode: 'SINGLE',
    entities: [],
  },
  totalShipment: 0,
};

export function uiReducer(state: UIState, action: { type: string, payload?: Object }) {
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
