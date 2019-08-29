// @flow
import { createContext } from 'react';
import type { OrderPayload } from 'generated/graphql';
import produce from 'immer';
import update from 'immutability-helper';
import type { State } from './type.js.flow';

type ContextProps = {|
  state: State,
  dispatch: Function,
|};

const initMoveEntity = {
  from: {
    id: '',
    icon: 'BATCH',
    value: '',
  },
  to: {
    id: '',
    icon: 'ORDER',
    value: '',
  },
};

export const initialState: State = {
  order: {},
  targets: [],
  isDragging: false,
  moveEntity: {
    isOpen: false,
    isProcessing: false,
    detail: initMoveEntity,
  },
  edit: {
    type: '',
    selectedId: '',
  },
  permission: {},
};

export const RelationMapContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

export function reducer(
  state: State,
  action: {
    type: | 'FETCH_ORDER'
      | 'FETCH_ORDERS'
      | 'TARGET'
      | 'TARGET_ALL'
      | 'TARGET_TREE'
      | 'DND'
      | 'START_DND'
      | 'END_DND'
      | 'CANCEL_MOVE'
      | 'CONFIRM_MOVE'
      | 'CONFIRM_MOVE_START'
      | 'CONFIRM_MOVE_END'
      | 'FETCH_PERMISSION'
      | 'EDIT',
    payload: {
      entity?: string,
      targets?: Array<string>,
      orders?: Array<OrderPayload>,
      [string]: mixed,
    },
  }
) {
  switch (action.type) {
    case 'FETCH_ORDER':
      return update(state, {
        order: {
          $merge: action.payload,
        },
      });
    case 'FETCH_ORDERS': {
      return produce(state, draft => {
        const { orders = [] } = action.payload;
        orders.forEach(order => {
          if (order.id) {
            // eslint-disable-next-line no-param-reassign
            draft.order[order.id] = order;
          }
        });
      });
    }
    case 'EDIT':
      return update(state, {
        edit: {
          $merge: action.payload,
        },
      });
    case 'START_DND':
      return {
        ...state,
        isDragging: true,
      };
    case 'END_DND':
      return {
        ...state,
        isDragging: false,
      };
    case 'FETCH_PERMISSION':
      return update(state, {
        permission: {
          $merge: action.payload,
        },
      });
    case 'TARGET':
      return produce(state, draft => {
        if (draft.targets.includes(action.payload.entity)) {
          draft.targets.splice(draft.targets.indexOf(action.payload.entity), 1);
        } else {
          draft.targets.push(action.payload.entity || '');
        }
      });
    case 'TARGET_TREE': {
      return produce(state, draft => {
        const { targets = [], entity: sourceEntity = '' } = action.payload;
        const isTargetAll = targets.every(entity => draft.targets.includes(entity));

        targets.forEach(entity => {
          if (isTargetAll) {
            draft.targets.splice(draft.targets.indexOf(entity), 1);
          } else if (!draft.targets.includes(entity)) {
            draft.targets.push(entity);
          }
        });

        // case 1: source entity is targeted and remain tree is not targeting
        if (!draft.targets.includes(sourceEntity) && !isTargetAll) {
          draft.targets.push(sourceEntity);
        }

        // case 2: all entities has targeted except the source
        if (isTargetAll && draft.targets.includes(sourceEntity)) {
          targets.forEach(entity => {
            draft.targets.push(entity);
          });
        }
      });
    }
    case 'TARGET_ALL':
      return produce(state, draft => {
        const { targets = [] } = action.payload;
        const isTargetAll = targets.every(entity => draft.targets.includes(entity));
        targets.forEach(entity => {
          if (isTargetAll) {
            draft.targets.splice(draft.targets.indexOf(entity), 1);
          } else if (!draft.targets.includes(entity)) {
            draft.targets.push(entity);
          }
        });
      });
    case 'DND': {
      return update(state, {
        moveEntity: {
          isOpen: { $set: true },
          detail: { $set: action.payload },
        },
      });
    }
    case 'CANCEL_MOVE': {
      return update(state, {
        moveEntity: {
          isOpen: { $set: false },
          detail: { $set: initMoveEntity },
        },
      });
    }
    case 'CONFIRM_MOVE_END': {
      return update(state, {
        moveEntity: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
          detail: { $set: initMoveEntity },
        },
      });
    }
    case 'CONFIRM_MOVE_START': {
      return update(state, {
        moveEntity: {
          isProcessing: { $set: true },
        },
      });
    }
    default:
      return state;
  }
}
