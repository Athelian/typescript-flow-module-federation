// @flow
import logger from 'utils/logger';
import { flatten } from 'lodash';
import { SHIPMENT, BATCH, ORDER_ITEM, ORDER } from 'constants/keywords';
import { getByPathWithDefault } from 'utils/fp';
import type { UIState } from './type.js.flow';

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

export const uiInitState = (): UIState => {
  return {
    loading: false,
    error: false,
    showTag: getInitShowTag(),
    refetch: {
      orderIds: [],
      shipmentIds: [],
    },
    refetchAll: false,
    expandCards: {
      orders: [],
      shipments: [],
    },
    toggleShipmentList: getInitToggleShipmentList(),
    new: {
      orders: [],
      shipments: [],
      updateOrdersInput: [],
    },
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
    // all shipment on
    shipments: [],
    totalShipment: 0,
    split: {
      batches: {},
    },
    balanceSplit: {
      batches: [],
    },
    clone: {
      orders: {},
      orderItems: {},
      batches: {},
      shipments: {},
      shipmentNo: {},
    },
    constraint: {
      importerIds: [],
      exporterIds: [],
      partners: [],
    },
    connectOrder: {
      enableSelectMode: false,
      orderId: '',
      status: false,
      sourceOrder: {},
    },
    connectShipment: {
      enableSelectMode: false,
      status: false,
      shipmentId: '',
      lastResultId: '',
    },
  };
};

export function uiReducer(state: UIState, action: { type: string, payload?: Object }) {
  logger.warn({ action, state });
  switch (action.type) {
    case 'RESET':
      return uiInitState();
    case 'CLEAR_ERROR_MESSAGE':
      return {
        ...state,
        loading: false,
        error: false,
      };
    case 'REFETCH_ALL':
      return {
        ...state,
        refetchAll: getByPathWithDefault(false, 'payload.isEnable', action),
      };
    case 'CHANGE_SELECT_MODE': {
      return {
        ...state,
        connectOrder: {
          ...state.connectOrder,
          enableSelectMode: getByPathWithDefault('', 'payload.entity', action) === 'ORDER',
        },
        connectShipment: {
          ...state.connectShipment,
          enableSelectMode: getByPathWithDefault('', 'payload.entity', action) === 'SHIPMENT',
        },
      };
    }
    case 'SCROLL_TO_SHIPMENT': {
      const id = getByPathWithDefault('', 'payload.id', action);
      return {
        ...state,
        connectShipment: {
          ...state.connectShipment,
          lastResultId: id,
        },
      };
    }
    case 'NEW_ENTITY': {
      const entity = getByPathWithDefault('', 'payload.entity', action);
      const id = getByPathWithDefault('', 'payload.id', action);
      if (entity === 'ORDER') {
        return {
          ...state,
          refetch: {
            ...state.refetch,
            orderIds: [id],
          },
          new: {
            ...state.new,
            orders: [...state.new.orders, id],
          },
        };
      }

      return {
        ...state,
        refetch: {
          ...state.refetch,
          shipmentIds: [id],
        },
        new: {
          ...state.new,
          shipments: [...state.new.shipments, id],
        },
      };
    }
    case 'PREPARE_REMOVE_DATA': {
      const updateOrdersInput = getByPathWithDefault([], 'payload.updateOrdersInput', action);
      return {
        ...state,
        new: {
          ...state.new,
          updateOrdersInput,
        },
      };
    }
    case 'TOGGLE_SELECTED_ORDER': {
      const orderId = getByPathWithDefault('', 'payload.id', action);
      return {
        ...state,
        connectOrder: {
          ...state.connectOrder,
          orderId: orderId === state.connectOrder.orderId ? '' : orderId,
        },
      };
    }
    case 'TOGGLE_SELECTED_SHIPMENT': {
      const shipmentId = getByPathWithDefault('', 'payload.id', action);
      return {
        ...state,
        connectShipment: {
          ...state.connectShipment,
          shipmentId: shipmentId === state.connectShipment.shipmentId ? '' : shipmentId,
        },
      };
    }
    case 'REFETCH_BY': {
      const ids = getByPathWithDefault([], 'payload.ids', action);
      const entity = getByPathWithDefault('', 'payload.entity', action);
      const updateData = {};
      if (entity === 'ORDER') {
        updateData.orderIds = ids;
      } else {
        updateData.shipmentIds = ids;
      }

      return {
        ...state,
        refetch: {
          ...state.refetch,
          ...updateData,
        },
      };
    }
    case 'SPLIT_BATCH':
    case 'AUTO_FILL_BATCHES':
    case 'MOVE_TO_SHIPMENT':
    case 'DISCONNECT_SHIPMENT':
    case 'CLONE_ENTITIES':
      return {
        ...state,
        loading: true,
      };
    case 'MOVE_TO_ORDER':
      return {
        ...state,
        loading: true,
        connectOrder: {
          ...state.connectOrder,
          status: false,
          sourceOrder: getByPathWithDefault({}, 'payload.targetOrder', action),
        },
      };
    case 'MOVE_TO_NEW_SHIPMENT':
      return {
        ...state,
        connectShipment: {
          ...state.connectShipment,
          ...action.payload,
          status: false,
        },
      };
    case 'SPLIT_BATCH_ERROR':
    case 'AUTO_FILL_BATCHES_ERROR':
    case 'CLONE_ENTITIES_ERROR':
    case 'MOVE_TO_ORDER_ERROR':
    case 'MOVE_TO_SHIPMENT_ERROR':
    case 'REMOTE_ENTITIES_ERROR':
    case 'DISCONNECT_SHIPMENT_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };
    case 'DISCONNECT_SHIPMENT_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
      };
    case 'REMOTE_ENTITIES_SUCCESS': {
      const targets = [];
      const exporterIds = [];
      return {
        ...state,
        loading: false,
        error: false,
        connectOrder: {
          ...state.connectOrder,
          orderId: '',
          exporterIds,
        },
        targets,
      };
    }
    case 'MOVE_TO_ORDER_SUCCESS': {
      const orders = getByPathWithDefault([], 'payload.data', action);
      const targets = [];
      const exporterIds = [];
      const { sourceOrder } = state.connectOrder;
      const updateOrder = orders.find(item => item.id === sourceOrder.id);
      if (updateOrder) {
        const { exporter, orderItems } = updateOrder;
        orderItems.forEach(orderItem => {
          if (!sourceOrder.orderItems.map(item => item.id).includes(orderItem.id)) {
            targets.push(`${ORDER_ITEM}-${orderItem.id}`);
            exporterIds.push(`${orderItem.id}-${exporter.id}`);
            orderItem.batches.forEach(batch => {
              targets.push(`${BATCH}-${batch.id}`);
              if (!exporterIds.includes(`${batch.id}-${exporter.id}`)) {
                exporterIds.push(`${batch.id}-${exporter.id}`);
              }
            });
          } else {
            const findOrderItem = sourceOrder.orderItems.find(item => item.id === orderItem.id);
            if (findOrderItem) {
              orderItem.batches.forEach(batch => {
                if (!findOrderItem.batches.includes(batch.id)) {
                  targets.push(`${BATCH}-${batch.id}`);
                  if (!exporterIds.includes(`${batch.id}-${exporter.id}`)) {
                    exporterIds.push(`${batch.id}-${exporter.id}`);
                  }
                }
              });
            } else {
              orderItem.batches.forEach(batch => {
                targets.push(`${BATCH}-${batch.id}`);
                if (!exporterIds.includes(`${batch.id}-${exporter.id}`)) {
                  exporterIds.push(`${batch.id}-${exporter.id}`);
                }
              });
            }
          }
        });
      }
      return {
        ...state,
        loading: false,
        error: false,
        connectOrder: {
          ...state.connectOrder,
          status: true,
          orderId: '',
          exporterIds,
        },
        targets,
      };
    }
    case 'MOVE_TO_SHIPMENT_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: false,
        connectShipment: {
          ...state.connectShipment,
          status: true,
          shipmentId: '',
        },
      };
    }
    case 'CLEAR_CONNECT_MESSAGE': {
      return {
        ...state,
        loading: false,
        error: false,
        connectOrder: {
          ...state.connectOrder,
          status: false,
        },
        connectShipment: {
          ...state.connectShipment,
          status: false,
        },
      };
    }
    case 'SPLIT_BATCH_SUCCESS': {
      const batchId = getByPathWithDefault('', 'payload.batchId', action);
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
        },
        targets: getByPathWithDefault([], 'payload.data.batches', action)
          .filter(item => item && item.id !== batchId)
          .map(batch => `${BATCH}-${batch.id}`),
        loading: false,
        error: false,
      };
    }
    case 'AUTO_FILL_BATCHES_SUCCESS': {
      const batches = getByPathWithDefault([], 'payload.data', action).reduce(
        (result, currentItem) => result.concat(currentItem.batches),
        []
      );
      return {
        ...state,
        balanceSplit: {
          batches: [...state.balanceSplit.batches, ...batches],
        },
        targets: batches.map(({ id }) => `${BATCH}-${id}`),
        loading: false,
        error: false,
      };
    }
    case 'CLONE_ENTITIES_SUCCESS': {
      const { orders, batches, shipments, orderItems, shipmentNo } = state.clone;
      const targets = [];
      getByPathWithDefault([], 'payload.data', action).forEach(({ type, items }) => {
        switch (type) {
          case ORDER:
            items.forEach(({ id, order }) => {
              orders[id] = orders[id] ? [...orders[id], order] : [order];
              targets.push(`${ORDER}-${order.id}`);
              if (order.orderItems && order.orderItems.length) {
                order.orderItems.forEach(orderItem => {
                  targets.push(`${ORDER_ITEM}-${orderItem.id}`);
                  if (orderItem.batches && orderItem.batches.length) {
                    orderItem.batches.forEach(batch => {
                      targets.push(`${BATCH}-${batch.id}`);
                    });
                  }
                });
              }
            });

            break;
          case ORDER_ITEM:
            items.forEach(({ id, orderItem }) => {
              orderItems[id] = orderItems[id] ? [...orderItems[id], orderItem] : [orderItem];
              targets.push(`${ORDER_ITEM}-${orderItem.id}`);
              if (orderItem.batches && orderItem.batches.length) {
                orderItem.batches.forEach(batch => {
                  targets.push(`${BATCH}-${batch.id}`);
                });
              }
            });

            break;
          case BATCH:
            items.forEach(({ id, batch }) => {
              batches[id] = batches[id] ? [...batches[id], batch] : [batch];
              targets.push(`${BATCH}-${batch.id}`);
            });

            break;
          case SHIPMENT:
            items.forEach(({ id, shipment }) => {
              shipments[id] = shipments[id] ? [...shipments[id], shipment] : [shipment];
              shipmentNo[shipment.id] = shipment.no;
              targets.push(`${SHIPMENT}-${shipment.id}`);
            });

            break;

          default:
            break;
        }
      });

      return {
        ...state,
        clone: {
          shipmentNo,
          orders,
          orderItems,
          batches,
          shipments,
        },
        targets,
        loading: false,
        error: false,
      };
    }
    case 'CLEAR_ALL': {
      const { payload } = action;
      if (payload && payload.mode === 'TARGET') {
        return {
          ...state,
          constraint: {
            exporterIds: [],
            importerIds: [],
            partners: [],
          },
          targets: [],
          connectOrder: {
            ...state.connectOrder,
            status: false,
            orderId: '',
            exporterIds: [],
            sourceOrder: {},
          },
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
        constraint: { exporterIds, importerIds },
        targets,
      } = state;
      let result = [...targets];
      let exporters = [...exporterIds];
      let importers = [...importerIds];
      if (payload && payload.selectedItems && payload.entity) {
        const { selectedItems, entity } = payload;
        const selectedIds = selectedItems.map(item => item.id);
        if (
          state.select.entities.includes(entity) &&
          state.targets.filter(item => item.includes(`${entity}-`)).length === selectedIds.length
        ) {
          selectedItems.forEach(selectItem => {
            exporters = (exporterIds.filter(item => item !== selectItem.exporterId): Array<string>);
            importers = (importerIds.filter(item => item !== selectItem.importerId): Array<string>);
          });
          return {
            ...state,
            constraint: {
              ...state.constraint,
              exporterIds: exporters,
              importerIds: importers,
            },
            targets: (result.filter(
              targetItem => !targetItem.includes(`${entity}-`)
            ): Array<string>),
            select: {
              ...state.select,
              entities: (entities.filter(item => item !== payload.entity): Array<string>),
            },
          };
        }

        selectedItems.forEach(selectItem => {
          if (!result.includes(`${selectItem.entity}-${selectItem.id}`))
            result = [...result, `${selectItem.entity}-${selectItem.id}`];
          if (!exporterIds.includes(selectItem.exporterId))
            exporters = [...exporterIds, selectItem.exporterId];
          if (!importerIds.includes(selectItem.importerId))
            importers = [...importerIds, selectItem.importerId];
        });
        return {
          ...state,
          constraint: {
            partners: [
              ...new Set([
                ...state.constraint.partners,
                ...flatten(((payload && payload.selectedItems) || []).map(item => item.partners)),
              ]),
            ],
            exporterIds: exporters,
            importerIds: importers,
          },
          targets: result,
          select: {
            mode: 'ALL',
            entities: [...entities, payload.entity || ''],
          },
        };
      }
      return state;
    }
    case 'TARGET_NEW_ENTITY': {
      const { payload } = action;
      const targets = [];
      const exporterIds = [];
      if (payload) {
        const { selectItems = [] } = payload;
        selectItems.forEach(selectItem => {
          targets.push(`${selectItem.entity}-${selectItem.id}`);
          exporterIds.push(selectItem.exporterId);
        });
      }
      return {
        ...state,
        new: {
          ...state.new,
          updateOrdersInput: [],
        },
        connectOrder: {
          ...state.connectOrder,
          exporterIds,
        },
        targets,
      };
    }
    case 'SELECT_BRANCH': {
      const { payload } = action;
      const {
        targets,
        constraint: { exporterIds, importerIds },
      } = state;
      let result = [...targets];
      let exporters = [...exporterIds];
      let importers = [...importerIds];
      if (payload) {
        const { selectItems } = payload;
        if (
          selectItems.every(selectItem => result.includes(`${selectItem.entity}-${selectItem.id}`))
        ) {
          selectItems.forEach(selectItem => {
            result = (result.filter(
              item => item !== `${selectItem.entity}-${selectItem.id}`
            ): Array<string>);
            exporters = (exporterIds.filter(item => item !== selectItem.exporterId): Array<string>);
            importers = (importerIds.filter(item => item !== selectItem.importerId): Array<string>);
          });
        } else {
          selectItems.forEach(selectItem => {
            if (!result.includes(`${selectItem.entity}-${selectItem.id}`))
              result = [...result, `${selectItem.entity}-${selectItem.id}`];
            if (!exporterIds.includes(selectItem.exporterId))
              exporters = [...exporterIds, selectItem.exporterId];
            if (!importerIds.includes(selectItem.importerId))
              importers = [...importerIds, selectItem.importerId];
          });
        }
      }
      return {
        ...state,
        constraint: {
          partners: [
            ...new Set([
              ...state.constraint.partners,
              ...flatten(((payload && payload.selectItems) || []).map(item => item.partners)),
            ]),
          ],
          exporterIds: exporters,
          importerIds: importers,
        },
        targets: result,
      };
    }
    case 'TARGET_SHIPMENT_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${SHIPMENT}-${payload.id}`)) {
          return {
            ...state,
            clone: {
              ...state.clone,
              shipmentNo: {
                ...state.clone.shipmentNo,
                [payload.id]: payload.no,
              },
            },
            targets: (targets.filter(item => item !== `${SHIPMENT}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          clone: {
            ...state.clone,
            shipmentNo: {
              ...state.clone.shipmentNo,
              [payload.id]: payload.no,
            },
          },
          targets: [...targets, `${SHIPMENT}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_ORDER_ITEM_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${ORDER_ITEM}-${payload.id}`)) {
          return {
            ...state,
            constraint: {
              partners: [...new Set([...state.constraint.partners, ...payload.partners])],
              exporterIds: (state.constraint.exporterIds.filter(
                item => item !== payload.exporterId
              ): Array<string>),
              importerIds: (state.constraint.importerIds.filter(
                item => item !== payload.importerId
              ): Array<string>),
            },
            targets: (targets.filter(
              item => item !== `${ORDER_ITEM}-${payload.id}`
            ): Array<string>),
          };
        }
        return {
          ...state,
          constraint: {
            partners: [...new Set([...state.constraint.partners, ...payload.partners])],
            exporterIds: state.constraint.exporterIds.includes(payload.exporterId)
              ? state.constraint.exporterIds
              : [...state.constraint.exporterIds, payload.exporterId],
            importerIds: state.constraint.importerIds.includes(payload.importerId)
              ? state.constraint.importerIds
              : [...state.constraint.importerIds, payload.importerId],
          },
          targets: [...targets, `${ORDER_ITEM}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_ORDER_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${ORDER}-${payload.id}`)) {
          return {
            ...state,
            targets: (targets.filter(item => item !== `${ORDER}-${payload.id}`): Array<string>),
          };
        }
        return {
          ...state,
          targets: [...targets, `${ORDER}-${payload.id}`],
        };
      }
      return state;
    }
    case 'TARGET_BATCH_ENTITY': {
      const { payload } = action;
      const { targets } = state;
      if (payload) {
        if (targets.includes(`${BATCH}-${payload.id}`)) {
          const newTargets = (targets.filter(
            item => item !== `${BATCH}-${payload.id}`
          ): Array<string>);
          return {
            ...state,
            targets: newTargets,
            constraint: {
              partners: [...new Set([...state.constraint.partners, ...payload.partners])],
              exporterIds: (state.constraint.exporterIds.filter(
                item => item !== payload.exporterId
              ): Array<string>),
              importerIds: (state.constraint.importerIds.filter(
                item => item !== payload.importerId
              ): Array<string>),
            },
          };
        }
        const newTargets = [...targets, `${BATCH}-${payload.id}`];
        return {
          ...state,
          constraint: {
            partners: [...new Set([...state.constraint.partners, ...payload.partners])],
            exporterIds: [...state.constraint.exporterIds, payload.exporterId],
            importerIds: [...state.constraint.importerIds, payload.importerId],
          },
          targets: newTargets,
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
      const shipments = payload && payload.shipments ? payload.shipments : [];
      return { ...state, shipments, totalShipment: total };
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
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
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
