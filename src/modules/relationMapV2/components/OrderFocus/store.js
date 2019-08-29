// @flow
import { createContext } from 'react';
import type { OrderPayload, OrderItemPayload } from 'generated/graphql';
import { intersection } from 'lodash';
import produce from 'immer';
import update from 'immutability-helper';
import { ORDER_ITEM, BATCH } from 'modules/relationMapV2/constants';
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
      | 'RECHECK_TARGET'
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
      orderUpdate?: OrderPayload,
      orderItemUpdate?: OrderItemPayload,
      mapping?: Object,
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
    case 'RECHECK_TARGET': {
      // $FlowIssue order may be forbidden or not found so flow complain about the id is not found on this case
      if (action.payload?.orderUpdate?.id) {
        return produce(state, draft => {
          // $FlowIssue order may be forbidden or not found so flow complain about the id is not found on this case
          const orderId = action.payload?.orderUpdate?.id ?? '';
          if (!orderId) {
            return;
          }
          // $FlowIssue order may be forbidden or not found so flow complain about the orderItems is not found on this case
          const orderItems = action.payload?.orderUpdate?.orderItems ?? [];
          const previousIds = {
            orderItemIds: action.payload?.mapping?.orders?.[orderId].orderItems ?? [],
            mapping: {},
          };
          previousIds.orderItemIds.forEach(itemId => {
            previousIds.mapping[itemId] =
              action.payload?.mapping?.orderItems?.[itemId]?.batches ?? [];
          });
          const orderItemIds = orderItems.map(item => item.id);
          const existItemIds = intersection(previousIds.orderItemIds, orderItemIds);
          previousIds.orderItemIds.forEach(itemId => {
            if (!existItemIds.includes(itemId)) {
              // remove from targeting
              draft.targets.splice(draft.targets.indexOf(`${ORDER_ITEM}-${itemId || ''}`), 1);
              previousIds.mapping[itemId].forEach(batchId => {
                draft.targets.splice(draft.targets.indexOf(`${BATCH}-${batchId || ''}`), 1);
              });
            } else {
              // find a batch was removed from item
              const existBatchIds = intersection(
                previousIds.mapping[itemId],
                (orderItems?.[itemId]?.batches ?? []).map(batch => batch.id)
              );
              previousIds.mapping[itemId].forEach(batchId => {
                if (!existBatchIds.includes(batchId))
                  draft.targets.splice(draft.targets.indexOf(`${BATCH}-${batchId || ''}`), 1);
              });
            }
          });
        });
      }

      // $FlowIssue order item may be forbidden or not found so flow complain about the id is not found on this case
      if (action.payload?.orderItemUpdate?.id) {
        return produce(state, draft => {
          // $FlowIssue order item may be forbidden or not found so flow complain about the id is not found on this case
          const itemId = action.payload?.orderItemUpdate?.id ?? '';
          const previousBatchIds = action.payload?.mapping?.orderItems?.[itemId]?.batches ?? [];
          // $FlowIssue order may be forbidden or not found so flow complain about the orderItems is not found on this case
          const batches = action.payload?.orderItemUpdate?.batches ?? [];
          const existBatchIds = intersection(previousBatchIds, batches.map(batch => batch.id));

          // find a batch was removed from item
          previousBatchIds.forEach(batchId => {
            if (!existBatchIds.includes(batchId))
              draft.targets.splice(draft.targets.indexOf(`${BATCH}-${batchId || ''}`), 1);
          });
        });
      }

      return state;
    }
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
