// @flow
/* eslint-disable no-param-reassign */
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Hit, Order, OrderItem } from 'generated/graphql';
import { intersection } from 'lodash';
// $FlowFixMe missing define for partialRight
import { partialRight } from 'ramda';
import { createContainer } from 'unstated-next';
import produce from 'immer';
import { isEquals } from 'utils/fp';
import usePersistFilter from 'hooks/usePersistFilter';
import { ORDER, ORDER_ITEM, BATCH, CARGO_READY } from 'modules/relationMapV2/constants';
import { normalizeEntity } from 'modules/relationMapV2/components/OrderFocus/normalize';
import { sortOrderItemBy, sortBatchBy } from './sort';

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
  orders: Array<Order>,
  entities: Object,
};

function useEntities(
  initialState: RelationMapEntities = {
    orders: [],
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

  const getRelatedBy = (type: 'batch' | 'orderItem' | 'order', id: string) => {
    if (!related?.[type]?.[id]) {
      return [];
    }

    const relatedIds = related?.[type]?.[id] ?? [];
    return findRelateIds(relatedIds, type);
  };

  const checkRemoveEntities = (entity: Order | OrderItem) => {
    switch (entity.__typename) {
      case 'Order': {
        setMapping(
          produce(mapping, draft => {
            const orderId = entity.id || '';
            if (!orderId) {
              return;
            }
            const orderItems = entity.orderItems || [];
            const previousIds = {
              orderItemIds: draft.entities.orders?.[orderId].orderItems ?? [],
              mapping: {},
            };
            previousIds.orderItemIds.forEach(itemId => {
              previousIds.mapping[itemId] = draft.entities.orderItems?.[itemId]?.batches ?? [];
            });
            // $FlowIgnore flow doesn't support this way yet
            const orderItemIds = orderItems.map(item => item.id);
            const existItemIds = intersection(previousIds.orderItemIds, orderItemIds);
            previousIds.orderItemIds.forEach(itemId => {
              if (!existItemIds.includes(itemId)) {
                delete draft.entities.orderItems[itemId];
                previousIds.mapping[itemId].forEach(batchId => {
                  delete draft.entities.batches[batchId];
                });
              } else {
                const existBatchIds = intersection(
                  previousIds.mapping[itemId],
                  // $FlowIgnore flow doesn't support this way yet
                  (orderItems?.[itemId]?.batches ?? []).map(batch => batch.id)
                );
                previousIds.mapping[itemId].forEach(batchId => {
                  if (!existBatchIds.includes(batchId)) delete draft.entities.batches[batchId];
                });
              }
            });
          })
        );
        break;
      }

      case 'OrderItem': {
        setMapping(
          produce(mapping, draft => {
            const itemId = entity.id || '';
            const batches = entity.batches || [];
            const existBatchIds = intersection(
              draft.entities.orderItems?.[itemId]?.batches ?? [],
              // $FlowIgnore flow doesn't support this way yet
              batches.map(batch => batch.id)
            );

            (draft.entities.orderItems?.[itemId]?.batches ?? []).forEach(batchId => {
              if (!existBatchIds.includes(batchId)) delete draft.entities.batches[batchId];
            });
          })
        );
        break;
      }

      default:
        break;
    }
  };
  return {
    mapping,
    initMapping,
    checkRemoveEntities,
    badge,
    onSetBadges,
    getRelatedBy,
    onSetCloneRelated,
    onSetSplitBatchRelated,
  };
}

export const Entities = createContainer(useEntities);

export const SortAndFilter = createContainer(partialRight(usePersistFilter, 'NRMFilter'));

type SortField = {
  sort: {
    field: string,
    direction: string,
  },
};

function useClientSorts(
  initSorts: {
    orderItem: SortField,
    batch: SortField,
  } = {
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
  }
) {
  const cacheKey = 'NRMLocalSorts';
  const localFilter = window.localStorage.getItem(cacheKey);
  const orderItemsSort = useRef({});
  const batchesSort = useRef({});
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
    (mapping: { orders: Array<Order> }, { type, filters }: { type: string, filters: Object }) => {
      const { orders } = mapping;
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
            batchesSort.current[orderItem.id] = sortBatchBy(
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
      mapping: { orders: Array<Order> },
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

  const getBatchesSortByItemId = ({
    id,
    batches,
    getRelatedBy,
  }: {|
    id: string,
    batches: Array<Object>,
    getRelatedBy: Function,
  |}): Array<string> => {
    if (!batchesSort.current?.[id]) {
      batchesSort.current[id] = sortBatchBy(batches, filterAndSort.batch.sort)
        .map((batch: Object) => batch?.id ?? '')
        .filter(Boolean);
    }

    const sorted = batchesSort.current?.[id] ?? [];
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
