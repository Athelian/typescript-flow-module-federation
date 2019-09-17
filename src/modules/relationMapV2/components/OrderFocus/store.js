// @flow
/* eslint-disable no-param-reassign */
import { createContext } from 'react';
import type { Order, Batch, OrderItem } from 'generated/graphql';
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
  itemActions: {
    isOpen: false,
    isProcessing: false,
    detail: {
      entity: {
        id: '',
        no: '',
      },
    },
  },
  batchActions: {
    isOpen: false,
    isProcessing: false,
    detail: {
      entity: {
        id: '',
        no: '',
      },
    },
  },
  createItem: {
    isOpen: false,
    isProcessing: false,
    detail: {
      entity: {
        id: '',
      },
    },
  },
  clone: {
    source: '',
    isOpen: false,
    isProcessing: false,
  },
  edit: {
    type: '',
    selectedId: '',
  },
  newOrders: [],
};

export const RelationMapContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

export function reducer(
  state: State,
  action: {
    // prettier-ignore
    type: | 'NEW_ORDER'
      | 'RESET_NEW_ORDERS'
      | 'FETCH_ORDERS'
      | 'TARGET'
      | 'TARGET_ALL'
      | 'TARGET_TREE'
      | 'RECHECK_TARGET'
      | 'REMOVE_TARGETS'
      | 'DND'
      | 'START_DND'
      | 'END_DND'
      | 'CANCEL_MOVE'
      | 'CONFIRM_MOVE'
      | 'CONFIRM_MOVE_START'
      | 'CONFIRM_MOVE_END'
      | 'CREATE_BATCH'
      | 'CREATE_BATCH_START'
      | 'CREATE_BATCH_END'
      | 'CREATE_BATCH_CLOSE'
      | 'DELETE_BATCH'
      | 'DELETE_BATCH_START'
      | 'DELETE_BATCH_END'
      | 'DELETE_BATCH_CLOSE'
      | 'DELETE_ITEM'
      | 'DELETE_ITEM_START'
      | 'DELETE_ITEM_END'
      | 'DELETE_ITEM_CLOSE'
      | 'CREATE_ITEM'
      | 'CREATE_ITEM_START'
      | 'CREATE_ITEM_END'
      | 'CREATE_ITEM_CLOSE'
      | 'CLONE'
      | 'CLONE_START'
      | 'CLONE_END'
      | 'CLONE_CLOSE'
      | 'EDIT',
    payload: {
      entity?: string,
      targets?: Array<string>,
      orders?: Array<Order>,
      orderUpdate?: Order,
      batch?: Batch,
      orderItemUpdate?: OrderItem,
      mapping?: Object,
      source?: string,
      [string]: mixed,
    },
  }
) {
  switch (action.type) {
    case 'NEW_ORDER':
      return update(state, {
        newOrders: {
          $set: [action.payload.orderId, ...state.newOrders],
        },
      });
    case 'RESET_NEW_ORDERS':
      return update(state, {
        newOrders: {
          $set: [],
        },
      });
    case 'FETCH_ORDERS': {
      return produce(state, draft => {
        const { orders = [] } = action.payload;
        orders.forEach(order => {
          if (order.id) {
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
    case 'TARGET':
      return produce(state, draft => {
        if (draft.targets.includes(action.payload.entity)) {
          draft.targets.splice(draft.targets.indexOf(action.payload.entity), 1);
        } else {
          draft.targets.push(action.payload.entity || '');
        }
      });
    case 'REMOVE_TARGETS':
      return produce(state, draft => {
        const { targets = [] } = action.payload;
        targets.forEach(entity => {
          draft.targets = draft.targets.filter(item => item !== entity);
        });
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
      if (action.payload?.orderUpdate?.id) {
        return produce(state, draft => {
          const orderId = action.payload?.orderUpdate?.id ?? '';
          if (!orderId) {
            return;
          }
          // $FlowIgnore flow doesn't support this way yet
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
              if (draft.targets.includes(`${ORDER_ITEM}-${itemId || ''}`))
                draft.targets.splice(draft.targets.indexOf(`${ORDER_ITEM}-${itemId || ''}`), 1);
              previousIds.mapping[itemId].forEach(batchId => {
                if (draft.targets.includes(`${BATCH}-${batchId || ''}`))
                  draft.targets.splice(draft.targets.indexOf(`${BATCH}-${batchId || ''}`), 1);
              });
            } else {
              const existBatchIds = intersection(
                previousIds.mapping[itemId],
                (orderItems?.[itemId]?.batches ?? []).map(batch => batch.id)
              );
              previousIds.mapping[itemId].forEach(batchId => {
                if (
                  !existBatchIds.includes(batchId) &&
                  draft.targets.includes(`${BATCH}-${batchId || ''}`)
                )
                  draft.targets.splice(draft.targets.indexOf(`${BATCH}-${batchId || ''}`), 1);
              });
            }
          });
        });
      }

      if (action.payload?.orderItemUpdate?.id) {
        return produce(state, draft => {
          const itemId = action.payload?.orderItemUpdate?.id ?? '';
          const previousBatchIds = action.payload?.mapping?.orderItems?.[itemId]?.batches ?? [];
          // $FlowIgnore flow doesn't support this way yet
          const batches = action.payload?.orderItemUpdate?.batches ?? [];
          const existBatchIds = intersection(previousBatchIds, batches.map(batch => batch.id));

          previousBatchIds.forEach(batchId => {
            if (
              !existBatchIds.includes(batchId) &&
              draft.targets.includes(`${BATCH}-${batchId || ''}`)
            )
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
    case 'CREATE_BATCH': {
      return update(state, {
        itemActions: {
          type: { $set: 'createBatch' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'DELETE_ITEM': {
      return update(state, {
        itemActions: {
          type: { $set: 'deleteItem' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'DELETE_BATCH': {
      return update(state, {
        batchActions: {
          type: { $set: 'deleteBatch' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'DELETE_BATCH_START':
      return update(state, {
        batchActions: {
          isProcessing: { $set: true },
        },
      });
    case 'DELETE_ITEM_START':
    case 'CREATE_BATCH_START': {
      return update(state, {
        itemActions: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'CREATE_BATCH_END': {
      // $FlowIssue it should be okay because we use new syntax for fallback if the property is not exist
      const orderId = action.payload?.batch?.orderItem?.order?.id ?? '';
      const { orderItem, ...batch } = action.payload?.batch ?? {};
      // $FlowIssue it should be okay because we use new syntax for fallback if the property is not exist
      const orderItemId = action.payload?.batch?.orderItem?.id ?? '';
      const itemIndex = state.order[orderId].orderItems.findIndex(item => item.id === orderItemId);
      return update(state, {
        order: {
          [orderId]: {
            orderItems: {
              [itemIndex]: {
                batches: {
                  $push: [batch],
                },
              },
            },
          },
        },
        itemActions: {
          isProcessing: { $set: false },
          detail: {
            entity: {
              $merge: {
                id: '',
              },
            },
          },
        },
      });
    }
    case 'DELETE_BATCH_CLOSE':
      return update(state, {
        batchActions: {
          type: { $set: '' },
          isOpen: { $set: false },
        },
      });
    case 'DELETE_ITEM_CLOSE':
    case 'CREATE_BATCH_CLOSE': {
      return update(state, {
        itemActions: {
          type: { $set: '' },
          isOpen: { $set: false },
        },
      });
    }
    case 'CLONE': {
      return update(state, {
        clone: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'CLONE_START': {
      return update(state, {
        clone: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'CLONE_END': {
      return update(state, {
        clone: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'CREATE_ITEM': {
      return update(state, {
        createItem: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'CREATE_ITEM_START': {
      return update(state, {
        createItem: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'CREATE_ITEM_END': {
      return update(state, {
        createItem: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    default:
      return state;
  }
}
