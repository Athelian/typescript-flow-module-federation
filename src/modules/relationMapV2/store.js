// @flow
/* eslint-disable no-param-reassign */
import type { Hit, Order, Shipment, Batch, OrderItem } from 'generated/graphql';
import { useState, useRef, useEffect, useCallback, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import update from 'immutability-helper';
import produce from 'immer';
import { isEquals } from 'utils/fp';
import usePersistFilter from 'hooks/usePersistFilter';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  CARGO_READY,
} from 'modules/relationMapV2/constants';
import { normalizeEntity } from 'modules/relationMapV2/components/OrderFocus/normalize';
import { sortOrderItemBy, sortBatchBy, sortContainerBy } from './sort';
import { targetedIds, findParentIdsByBatch } from './helpers';
import type { State } from './type.js.flow';

const defaultState = [];
function useHits(initialState: Object = defaultState) {
  const [hits, setHits] = useState<Array<Hit>>(initialState);
  const initHits = (newHits: Array<Hit>) => {
    if (!isEquals(newHits, hits)) {
      setHits(newHits);
    }
  };
  const matches = normalizeEntity({ hits });
  return { hits, matches, initHits };
}

export const Hits = createContainer(useHits);

type RelationMapEntities = {
  orders?: Array<Order>,
  shipments?: Array<Shipment>,
  entities: Object,
};

function useEntities(
  initialState: RelationMapEntities = {
    orders: [],
    shipments: [],
    entities: {},
  }
) {
  const [mapping, setMapping] = useState<RelationMapEntities>(initialState);
  const [badge, setBadge] = useState<{
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
    container: Object,
  }>({
    order: {},
    batch: {},
    orderItem: {},
    container: {},
    shipment: {},
  });
  const [related, setRelated] = useState<{
    order: Object,
    orderItem: Object,
    batch: Object,
    shipment: Object,
    container: Object,
  }>({
    order: {},
    orderItem: {},
    batch: {},
    container: {},
    shipment: {},
  });

  const onSetBadges = (entities: Array<{ id: string, type: string, entity: string }>) => {
    setBadge(
      produce(badge, draft => {
        entities.forEach(({ id, entity, type }) => {
          draft[entity][id] = type;
        });
      })
    );
  };

  const onSetSplitBatchRelated = (batchIds: Object) => {
    setRelated(
      produce(related, draft => {
        Object.keys(batchIds).forEach(batchId => {
          if (!related.batch[batchId]) {
            draft.batch[batchId] = [batchIds[batchId]];
          } else {
            draft.batch[batchId] = [batchIds[batchId], ...related.batch[batchId]];
          }
        });
      })
    );
  };

  const onSetCloneRelated = (
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>
  ) => {
    setRelated(
      produce(related, draft => {
        const batches = sources.filter(item => item.type === BATCH);
        const cloneBatches =
          cloneEntities.find(item => item.data.batchCloneMany)?.data?.batchCloneMany ?? [];
        batches.forEach((batch, index) => {
          if (!related.batch[batch.id]) {
            draft.batch[batch.id] = [cloneBatches?.[index]?.id];
          } else {
            draft.batch[batch.id] = [cloneBatches?.[index]?.id, ...related.batch[batch.id]];
          }
        });
        const orderItems = sources.filter(item => item.type === ORDER_ITEM);
        const cloneOrderItems =
          cloneEntities.find(item => item.data.orderItemCloneMany)?.data?.orderItemCloneMany ?? [];
        orderItems.forEach((orderItem, index) => {
          if (!related.orderItem[orderItem.id]) {
            draft.orderItem[orderItem.id] = [cloneOrderItems?.[index]?.id];
          } else {
            draft.orderItem[orderItem.id] = [
              cloneOrderItems?.[index]?.id,
              ...related.orderItem[orderItem.id],
            ];
          }
        });
        const orders = sources.filter(item => item.type === ORDER);
        const cloneOrders =
          cloneEntities.find(item => item.data.orderCloneMany)?.data?.orderCloneMany ?? [];
        orders.forEach((order, index) => {
          if (!related.order[order.id]) {
            draft.order[order.id] = [cloneOrders?.[index]?.id];
          } else {
            draft.order[order.id] = [cloneOrders?.[index]?.id, ...related.order[order.id]];
          }
        });
        const shipments = sources.filter(item => item.type === SHIPMENT);
        const cloneShipments =
          cloneEntities.find(item => item.data.shipmentCloneMany)?.data?.shipmentCloneMany ?? [];
        shipments.forEach((shipment, index) => {
          if (!related.shipment[shipment.id]) {
            draft.shipment[shipment.id] = [cloneShipments?.[index]?.id];
          } else {
            draft.shipment[shipment.id] = [
              cloneShipments?.[index]?.id,
              ...related.shipment[shipment.id],
            ];
          }
        });
        const containers = sources.filter(item => item.type === CONTAINER);
        const cloneContainers =
          cloneEntities.find(item => item.data.containerCloneMany)?.data?.containerCloneMany ?? [];
        containers.forEach((container, index) => {
          if (!related.container[container.id]) {
            draft.container[container.id] = [cloneContainers?.[index]?.id];
          } else {
            draft.container[container.id] = [
              cloneContainers?.[index]?.id,
              ...related.container[container.id],
            ];
          }
        });
      })
    );
  };

  const initMapping = (newMapping: RelationMapEntities) => {
    if (!isEquals(newMapping, mapping)) {
      setMapping(newMapping);
    }
  };

  const findRelateIds = useCallback(
    (relatedIds: Array<string>, type: string) => {
      const ids = [];
      relatedIds.forEach(id => {
        if (related?.[type]?.[id]?.length) {
          ids.push(id, ...findRelateIds(related?.[type]?.[id] ?? [], type));
        } else {
          ids.push(id);
        }
      });
      return ids;
    },
    [related]
  );

  const getRelatedBy = (
    type: 'batch' | 'orderItem' | 'order' | 'shipment' | 'container',
    id: string
  ) => {
    if (!related?.[type]?.[id]) {
      return [];
    }

    const relatedIds = related?.[type]?.[id] ?? [];
    return findRelateIds(relatedIds, type);
  };

  return {
    mapping,
    initMapping,
    badge,
    onSetBadges,
    getRelatedBy,
    onSetCloneRelated,
    onSetSplitBatchRelated,
  };
}

export const Entities = createContainer(useEntities);

const useSortAndFilter = (type: 'NRMOrder' | 'NRMShipment' = 'NRMOrder') => {
  return usePersistFilter(
    {
      filter: {
        query: '',
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    type
  );
};

export const SortAndFilter = createContainer(useSortAndFilter);

function useClientSorts(viewer: 'NRMOrder' | 'NRMShipment' = 'NRMOrder') {
  const initSorts = {
    orderItem: {
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    },
    batch: {
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    },
    container: {
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
    },
  };
  const cacheKey = `${viewer}LocalSort`;
  const localFilter = window.localStorage.getItem(cacheKey);
  const orderItemsSort = useRef({});
  const batchesSort = useRef({});
  const containersSort = useRef({});
  let initialFilter;
  try {
    initialFilter = localFilter
      ? {
          ...initSorts,
          ...JSON.parse(localFilter),
        }
      : initSorts;
  } catch {
    initialFilter = initSorts;
  }

  const [filterAndSort, changeFilterAndSort] = useState(initialFilter);

  const onLocalSort = useCallback(
    (
      mapping: { orders?: Array<Order>, shipments?: Array<Shipment> },
      { type, filters }: { type: string, filters: Object }
    ) => {
      const { orders = [], shipments = [] } = mapping;
      orders.forEach((order: Object) => {
        if (type === 'orderItem') {
          orderItemsSort.current[order.id] = sortOrderItemBy(
            order?.orderItems ?? [],
            filters.orderItem?.sort ?? {
              field: 'updatedAt',
              direction: 'DESCENDING',
            }
          )
            .map((item: Object) => item?.id ?? '')
            .filter(Boolean);
        }
        if (type === 'batch') {
          (order?.orderItems ?? []).forEach(orderItem => {
            const sortId = `${orderItem.id}-${ORDER_ITEM}`;
            batchesSort.current[sortId] = sortBatchBy(
              orderItem?.batches ?? [],
              filters.batch?.sort ?? {
                field: 'updatedAt',
                direction: 'DESCENDING',
              }
            )
              .map((batch: Object) => batch?.id ?? '')
              .filter(Boolean);
          });
        }
      });
      shipments.forEach((shipment: Object) => {
        if (type === 'container') {
          containersSort.current[shipment.id] = sortContainerBy(
            shipment?.containers ?? [],
            filters.container?.sort ?? {
              field: 'updatedAt',
              direction: 'DESCENDING',
            }
          )
            .map((container: Object) => container?.id ?? '')
            .filter(Boolean);
        }
        if (type === 'batch') {
          const batches = shipment?.batches ?? [];
          const containers = shipment?.containers ?? [];
          const batchesWithoutContainers = batches.filter(batch => !batch?.container);
          const batchesWithContainers = batches.filter(batch => !!batch?.container);
          const sortId = `${shipment.id}-${SHIPMENT}`;
          batchesSort.current[sortId] = sortBatchBy(
            batchesWithoutContainers,
            filters.batch?.sort ?? {
              field: 'updatedAt',
              direction: 'DESCENDING',
            }
          )
            .map((batch: Object) => batch?.id ?? '')
            .filter(Boolean);

          containers.forEach(container => {
            const containerSortId = `${container.id}-${CONTAINER}`;
            batchesSort.current[containerSortId] = sortBatchBy(
              batchesWithContainers.filter(batch => batch.container?.id === container.id),
              filters.batch?.sort ?? {
                field: 'updatedAt',
                direction: 'DESCENDING',
              }
            )
              .map((batch: Object) => batch?.id ?? '')
              .filter(Boolean);
          });
        }
      });
    },
    []
  );

  const onChangeFilter = useCallback(
    ({
      type,
      newFilter,
      mapping,
    }: {
      type: string,
      newFilter: Object,
      mapping: { orders?: Array<Order>, shipments?: Array<Shipment> },
    }) => {
      changeFilterAndSort(prevState => {
        const nextState = produce(prevState, draft => {
          draft[type] = newFilter;
        });

        onLocalSort(mapping, { type, filters: nextState });
        return nextState;
      });
    },
    [onLocalSort]
  );

  const getItemsSortByOrderId = ({
    id,
    orderItems,
    getRelatedBy,
  }: {|
    id: string,
    orderItems: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    if (!orderItemsSort.current[id]) {
      orderItemsSort.current[id] = sortOrderItemBy(orderItems, filterAndSort.orderItem.sort)
        .map((item: Object) => item?.id ?? '')
        .filter(Boolean);
    }

    const sorted = orderItemsSort.current?.[id] ?? [];

    // check a case if that was removed from cached sort
    const itemIds = orderItems.map(item => item.id);
    const validIds = sorted.filter(itemId => itemIds.includes(itemId));

    // find related
    const ids = [];
    validIds.forEach(itemId => {
      ids.push(itemId);
      const relatedIds = getRelatedBy('orderItem', itemId);
      relatedIds.forEach(currentId => {
        if (!ids.includes(currentId) && !validIds.includes(currentId)) {
          ids.push(currentId);
        }
      });
    });

    orderItems.forEach(item => {
      if (!ids.includes(item?.id) && item?.id) {
        const itemId = item?.id;
        ids.push(itemId);
        const relatedIds = getRelatedBy('orderItem', itemId);
        relatedIds.forEach(currentId => {
          if (!ids.includes(currentId) && !validIds.includes(currentId)) {
            ids.push(currentId);
          }
        });
      }
    });

    return ids;
  };

  const getContainersSortByShipmentId = ({
    id,
    containers,
    getRelatedBy,
  }: {|
    id: string,
    containers: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    if (!containersSort.current[id]) {
      containersSort.current[id] = sortContainerBy(containers, filterAndSort.container.sort)
        .map((item: Object) => item?.id ?? '')
        .filter(Boolean);
    }

    const sorted = containersSort.current?.[id] ?? [];

    // check a case if that was removed from cached sort
    const containerIds = containers.map(container => container.id);
    const validIds = sorted.filter(containerId => containerIds.includes(containerId));

    // find related
    const ids = [];
    validIds.forEach(itemId => {
      ids.push(itemId);
      const relatedIds = getRelatedBy('container', itemId);
      relatedIds.forEach(currentId => {
        if (!ids.includes(currentId) && !validIds.includes(currentId)) {
          ids.push(currentId);
        }
      });
    });

    containers.forEach(container => {
      if (!ids.includes(container?.id) && container?.id) {
        const containerId = container?.id;
        ids.push(containerId);
        const relatedIds = getRelatedBy('container', containerId);
        relatedIds.forEach(currentId => {
          if (!ids.includes(currentId) && !validIds.includes(currentId)) {
            ids.push(currentId);
          }
        });
      }
    });

    return ids;
  };

  const getBatchesSortBy = ({
    id,
    type,
    batches,
    getRelatedBy,
  }: {|
    id: string,
    type: string,
    batches: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    const sortId = `${id}-${type}`;
    if (!batchesSort.current?.[sortId]) {
      batchesSort.current[sortId] = sortBatchBy(batches, filterAndSort.batch.sort)
        .map((batch: Object) => batch?.id ?? '')
        .filter(Boolean);
    }

    const sorted = batchesSort.current?.[sortId] ?? [];
    // check a case if that was removed from cached sort
    const batchIds = batches.map(batch => batch.id);
    const validIds = sorted.filter(batchId => batchIds.includes(batchId));

    // find related
    const ids = [];
    validIds.forEach(batchId => {
      ids.push(batchId);
      const relatedIds = getRelatedBy('batch', batchId);
      relatedIds.forEach(currentId => {
        if (!ids.includes(currentId) && !validIds.includes(currentId)) {
          ids.push(currentId);
        }
      });
    });

    batches.forEach(batch => {
      if (!ids.includes(batch?.id) && batch?.id) {
        const batchId = batch?.id;
        ids.push(batchId);
        const relatedIds = getRelatedBy('batch', batchId);
        relatedIds.forEach(currentId => {
          if (!ids.includes(currentId) && !validIds.includes(currentId)) {
            ids.push(currentId);
          }
        });
      }
    });

    return ids;
  };

  const getBatchesSortByItemId = ({
    id,
    batches,
    getRelatedBy,
  }: {|
    id: string,
    batches: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    return getBatchesSortBy({
      id,
      batches,
      getRelatedBy,
      type: ORDER_ITEM,
    });
  };

  const getBatchesSortByShipmentId = ({
    id,
    batches,
    getRelatedBy,
  }: {|
    id: string,
    batches: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    return getBatchesSortBy({
      id,
      batches,
      getRelatedBy,
      type: SHIPMENT,
    });
  };

  const getBatchesSortByContainerId = ({
    id,
    batches,
    getRelatedBy,
  }: {|
    id: string,
    batches: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    return getBatchesSortBy({
      id,
      batches,
      getRelatedBy,
      type: CONTAINER,
    });
  };

  useEffect(() => {
    if (window.localStorage) {
      window.localStorage.setItem(cacheKey, JSON.stringify(filterAndSort));
    }
  }, [cacheKey, filterAndSort]);

  return {
    filterAndSort,
    onChangeFilter,
    getItemsSortByOrderId,
    getBatchesSortByItemId,
    getContainersSortByShipmentId,
    getBatchesSortByContainerId,
    getBatchesSortByShipmentId,
    onLocalSort,
  };
}

export const ClientSorts = createContainer(useClientSorts);

function useGlobalShipmentPoint(initialState = CARGO_READY) {
  const [globalShipmentPoint, setGlobalShipmentPoint] = useState(initialState);

  return { globalShipmentPoint, setGlobalShipmentPoint };
}

export const GlobalShipmentPoint = createContainer(useGlobalShipmentPoint);

function useExpandRow() {
  const [expandRows, setExpandRows] = useState([]);

  return {
    expandRows,
    setExpandRows,
  };
}

export const ExpandRows = createContainer(useExpandRow);

function useGlobalExpanded() {
  const [expandAll, setExpandAll] = useState(false);

  return {
    expandAll,
    setExpandAll,
  };
}

export const GlobalExpanded = createContainer(useGlobalExpanded);

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

const initialState: State = {
  viewer: 'Order',
  order: {},
  shipment: {},
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
  containerActions: {
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
      from: {
        id: '',
        type: 'SHIPMENT',
      },
    },
  },
  moveActions: {
    from: 'batch',
    isOpen: false,
    isProcessing: false,
    orderIds: [],
    containerIds: [],
    shipmentIds: [],
    importerIds: [],
    exporterIds: [],
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
  autoFill: {
    source: '',
    isOpen: false,
    isProcessing: false,
  },
  split: {
    source: '',
    isOpen: false,
    isProcessing: false,
  },
  followers: {
    source: ORDER,
    ids: [],
    isOpen: false,
    isProcessing: false,
  },
  status: {
    source: ORDER,
    isOpen: false,
    isProcessing: false,
  },
  deleteEntities: {
    source: ORDER_ITEM,
    isOpen: false,
    isProcessing: false,
  },
  deleteBatches: {
    isRemove: false,
    isOpen: false,
    isProcessing: false,
  },
  tags: {
    source: 'Order',
    isOpen: false,
    isProcessing: false,
  },
  edit: {
    type: '',
    selectedId: '',
  },
  newOrders: [],
  newShipments: [],
};

function orderReducer(
  state: State,
  action: {
    // prettier-ignore
    type: | 'NEW_ORDER'
      | 'NEW_SHIPMENT'
      | 'RESET_NEW_ORDERS'
      | 'RESET_NEW_SHIPMENTS'
      | 'FETCH_ORDERS'
      | 'FETCH_SHIPMENTS'
      | 'TARGET'
      | 'TARGET_ALL'
      | 'TARGET_TREE'
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
      | 'DELETE_BATCH_CLOSE'
      | 'DELETE_BATCHES'
      | 'DELETE_BATCHES_START'
      | 'DELETE_BATCHES_CLOSE'
      | 'DELETE_ITEM'
      | 'DELETE_ITEM_START'
      | 'DELETE_ITEM_CLOSE'
      | 'CREATE_CONTAINER'
      | 'CREATE_CONTAINER_START'
      | 'CREATE_CONTAINER_END'
      | 'CREATE_CONTAINER_CLOSE'
      | 'DELETE_CONTAINER'
      | 'DELETE_CONTAINER_START'
      | 'DELETE_CONTAINER_CLOSE'
      | 'CREATE_ITEM'
      | 'CREATE_ITEM_START'
      | 'CREATE_ITEM_END'
      | 'CREATE_ITEM_CLOSE'
      | 'CLONE'
      | 'CLONE_START'
      | 'CLONE_END'
      | 'AUTO_FILL'
      | 'AUTO_FILL_START'
      | 'AUTO_FILL_END'
      | 'AUTO_FILL_CLOSE'
      | 'SPLIT'
      | 'SPLIT_START'
      | 'SPLIT_END'
      | 'SPLIT_CLOSE'
      | 'FOLLOWERS'
      | 'FOLLOWERS_START'
      | 'FOLLOWERS_CLOSE'
      | 'STATUS'
      | 'STATUS_START'
      | 'STATUS_END'
      | 'STATUS_CLOSE'
      | 'DELETE'
      | 'DELETE_START'
      | 'DELETE_END'
      | 'DELETE_CLOSE'
      | 'TAGS'
      | 'TAGS_START'
      | 'TAGS_END'
      | 'REMOVE_BATCH'
      | 'REMOVE_BATCH_START'
      | 'REMOVE_BATCH_CLOSE'
      | 'MOVE_ITEM'
      | 'MOVE_ITEM_START'
      | 'MOVE_ITEM_CLOSE'
      | 'MOVE_ITEM_END'
      | 'MOVE_ITEM_TO_NEW_ENTITY'
      | 'MOVE_BATCH'
      | 'MOVE_BATCH_START'
      | 'MOVE_BATCH_CLOSE'
      | 'MOVE_BATCH_END'
      | 'MOVE_TO_ORDER_START'
      | 'MOVE_TO_ORDER_CLOSE'
      | 'MOVE_TO_CONTAINER_START'
      | 'MOVE_TO_CONTAINER_CLOSE'
      | 'MOVE_TO_SHIPMENT_START'
      | 'MOVE_TO_SHIPMENT_CLOSE'
      | 'MOVE_BATCH_TO_NEW_ENTITY'
      | 'EDIT',
    payload: {
      entity?: string,
      targets?: Array<string>,
      orders?: Array<Order>,
      shipments?: Array<Shipment>,
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
    case 'NEW_SHIPMENT':
      return update(state, {
        newShipments: {
          $set: [action.payload.shipmentId, ...state.newShipments],
        },
      });
    case 'RESET_NEW_ORDERS':
      return update(state, {
        newOrders: {
          $set: [],
        },
      });
    case 'RESET_NEW_SHIPMENTS':
      return update(state, {
        newShipments: {
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
    case 'FETCH_SHIPMENTS': {
      return produce(state, draft => {
        const { shipments = [] } = action.payload;
        shipments.forEach(shipment => {
          if (shipment.id) {
            draft.shipment[shipment.id] = shipment;
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
    case 'CREATE_CONTAINER': {
      return update(state, {
        containerActions: {
          type: { $set: 'createContainer' },
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
    case 'DELETE_CONTAINER': {
      return update(state, {
        containerActions: {
          type: { $set: 'deleteContainer' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'REMOVE_BATCH': {
      return update(state, {
        batchActions: {
          type: { $set: 'removeBatch' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
          detail: { $set: action.payload },
        },
      });
    }
    case 'MOVE_ITEM': {
      return update(state, {
        itemActions: {
          type: { $set: 'moveItems' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
        },
      });
    }
    case 'MOVE_ITEM_TO_NEW_ENTITY':
      return action.payload?.selectedId === 'newOrder'
        ? update(state, {
            edit: {
              $merge: action.payload,
            },
          })
        : update(state, {
            edit: {
              $merge: action.payload,
            },
            moveActions: {
              from: { $set: 'item' },
              isOpen: { $set: false },
              isProcessing: { $set: false },
            },
          });
    case 'MOVE_BATCH': {
      return update(state, {
        batchActions: {
          type: { $set: 'moveBatches' },
          isOpen: { $set: true },
          isProcessing: { $set: false },
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
    case 'REMOVE_BATCH_START':
    case 'DELETE_BATCH_START':
      return update(state, {
        batchActions: {
          isProcessing: { $set: true },
        },
      });
    case 'MOVE_ITEM_START':
    case 'MOVE_BATCH_START':
      return update(state, {
        moveActions: {
          $merge: { ...action.payload, isOpen: true },
        },
      });
    case 'MOVE_TO_ORDER_START':
    case 'MOVE_TO_CONTAINER_START':
    case 'MOVE_TO_SHIPMENT_START':
      return update(state, {
        moveActions: {
          isProcessing: { $set: true },
        },
      });
    case 'MOVE_TO_ORDER_CLOSE':
    case 'MOVE_TO_CONTAINER_CLOSE':
    case 'MOVE_TO_SHIPMENT_CLOSE':
      return update(state, {
        batchActions: {
          isOpen: { $set: true },
        },
        moveActions: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    case 'MOVE_BATCH_TO_NEW_ENTITY':
      return action.payload?.selectedId === 'newContainer'
        ? update(state, {
            edit: {
              $merge: action.payload,
            },
          })
        : update(state, {
            edit: {
              $merge: action.payload,
            },
            moveActions: {
              from: { $set: 'batch' },
              isOpen: { $set: false },
              isProcessing: { $set: false },
            },
          });
    case 'MOVE_ITEM_END':
      return update(state, {
        itemActions: {
          type: { $set: '' },
          from: { $set: '' },
          isOpen: { $set: false },
        },
        moveActions: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    case 'MOVE_BATCH_END':
      return update(state, {
        batchActions: {
          isOpen: { $set: false },
        },
        moveActions: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    case 'DELETE_CONTAINER_START': {
      return update(state, {
        containerActions: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'DELETE_ITEM_START':
    case 'CREATE_BATCH_START': {
      return update(state, {
        itemActions: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'CREATE_BATCH_END': {
      return update(state, {
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
    case 'CREATE_CONTAINER_START': {
      return update(state, {
        containerActions: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'CREATE_CONTAINER_END': {
      return update(state, {
        containerActions: {
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
    case 'MOVE_BATCH_CLOSE':
    case 'REMOVE_BATCH_CLOSE':
    case 'DELETE_BATCH_CLOSE':
      return update(state, {
        batchActions: {
          type: { $set: '' },
          isOpen: { $set: false },
        },
      });
    case 'CREATE_CONTAINER_CLOSE':
    case 'DELETE_CONTAINER_CLOSE': {
      return update(state, {
        containerActions: {
          type: { $set: '' },
          isOpen: { $set: false },
        },
      });
    }
    case 'MOVE_ITEM_CLOSE':
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
    case 'SPLIT': {
      return update(state, {
        split: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'SPLIT_START': {
      return update(state, {
        split: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'SPLIT_CLOSE':
    case 'SPLIT_END': {
      return update(state, {
        split: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'AUTO_FILL': {
      return update(state, {
        autoFill: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'AUTO_FILL_START': {
      return update(state, {
        autoFill: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'AUTO_FILL_END':
    case 'AUTO_FILL_CLOSE': {
      return update(state, {
        autoFill: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'FOLLOWERS': {
      return update(state, {
        followers: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
          ids: { $set: action.payload?.ids ?? [] },
        },
      });
    }
    case 'FOLLOWERS_START': {
      return update(state, {
        followers: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          ids: { $set: action.payload?.ids ?? [] },
        },
      });
    }
    case 'FOLLOWERS_CLOSE': {
      return update(state, {
        followers: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'STATUS': {
      return update(state, {
        status: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'STATUS_START': {
      return update(state, {
        status: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'STATUS_END': {
      return update(state, {
        status: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'STATUS_CLOSE': {
      return update(state, {
        status: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'DELETE_BATCHES': {
      return update(state, {
        deleteBatches: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
        },
      });
    }
    case 'DELETE_BATCHES_START': {
      return update(state, {
        deleteBatches: {
          $merge: {
            ...action.payload,
            isProcessing: true,
          },
        },
      });
    }
    case 'DELETE_BATCHES_CLOSE': {
      return update(state, {
        deleteBatches: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'DELETE': {
      return update(state, {
        deleteEntities: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'DELETE_START': {
      return update(state, {
        deleteEntities: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'DELETE_END': {
      return update(state, {
        deleteEntities: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'DELETE_CLOSE': {
      return update(state, {
        deleteEntities: {
          isOpen: { $set: false },
          isProcessing: { $set: false },
        },
      });
    }
    case 'TAGS': {
      return update(state, {
        tags: {
          isOpen: { $set: true },
          isProcessing: { $set: false },
          source: { $set: action.payload?.source ?? '' },
        },
      });
    }
    case 'TAGS_START': {
      return update(state, {
        tags: {
          isProcessing: { $set: true },
        },
      });
    }
    case 'TAGS_END': {
      return update(state, {
        tags: {
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

function useFocusView(viewer: 'Order' | 'Shipment') {
  const [state, dispatch] = useReducer(orderReducer, { ...initialState, viewer });
  return {
    state,
    selectors: {
      isOrderFocus: state.viewer === 'Order',
      isShipmentFocus: state.viewer === 'Shipment',
      isDragMultiEntities: (type: string) =>
        state.targets.filter(target => target.includes(`${type}-`)).length > 1,
      isTargeted: (id: string, type: string) => state.targets.includes(`${type}-${id}`),
      targetedBatchIds: () => targetedIds(state.targets, BATCH),
      targetedOrderItemIds: () => targetedIds(state.targets, ORDER_ITEM),
      targetedContainerIds: () => targetedIds(state.targets, CONTAINER),
      relatedIds: (mapping: Object) => {
        const batchIds = targetedIds(state.targets, BATCH);
        const orderIds = [
          ...new Set(
            batchIds
              .map(batchId => {
                const [, parentOrderId] = findParentIdsByBatch({
                  batchId,
                  viewer: state.viewer,
                  entities: mapping.entities,
                });
                return parentOrderId;
              })
              .filter(Boolean)
          ),
        ];
        const containerIds = [
          ...new Set(
            batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.container).filter(Boolean)
          ),
        ];
        const shipmentIds = [
          ...new Set(
            batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.shipment).filter(Boolean)
          ),
        ];

        const importerIds = [];
        const exporterIds = [];
        orderIds.forEach(orderId => {
          const order = mapping.entities?.orders?.[orderId];
          const importId = order?.importer?.id;
          const exporterId = order?.exporter?.id;
          if (importId && !importerIds.includes(importId)) {
            importerIds.push(importId);
          }
          if (exporterId && !exporterIds.includes(exporterId)) {
            exporterIds.push(exporterId);
          }
        });

        return {
          batchIds,
          orderIds,
          containerIds,
          shipmentIds,
          importerIds,
          exporterIds,
        };
      },
    },
    dispatch,
  };
}

export const FocusedView = createContainer(useFocusView);
