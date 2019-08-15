// @flow
import { createContext } from 'react';
import type { OrderPayload } from 'generated/graphql';
import produce from 'immer';
import update from 'immutability-helper';
import type { State } from './type.js.flow';

type ContextProps = {
  state: State,
  dispatch: Function,
  orders: Array<OrderPayload>,
};

export const initialState: State = {
  order: {},
  targets: [],
};

export const RelationMapContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
  orders: [],
});

export function reducer(
  state: State,
  action: {
    type: 'FETCH_ORDER' | 'TARGET' | 'TARGET_ALL',
    payload: {
      entity?: string,
      targets?: Array<string>,
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
    case 'TARGET':
      return produce(state, draft => {
        if (draft.targets.includes(action.payload.entity)) {
          draft.targets.splice(draft.targets.indexOf(action.payload.entity), 1);
        } else {
          draft.targets.push(action.payload.entity || '');
        }
      });
    case 'TARGET_ALL':
      return produce(state, draft => {
        const { targets = [] } = action.payload;
        const isTargetAll = targets.every(entity => draft.targets.includes(entity));
        targets.forEach(entity => {
          if (isTargetAll) {
            draft.targets.splice(draft.targets.indexOf(action.payload.entity), 1);
          } else if (!draft.targets.includes(entity)) {
            draft.targets.push(entity);
          }
        });
      });
    default:
      return state;
  }
}
