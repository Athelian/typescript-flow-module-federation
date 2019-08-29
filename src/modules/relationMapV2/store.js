// @flow
/* eslint-disable no-param-reassign */
import { useState } from 'react';
import type { Hit, Order, OrderItem } from 'generated/graphql';
import { intersection } from 'lodash';
import { createContainer } from 'unstated-next';
import produce from 'immer';
import { isEquals } from 'utils/fp';
import { normalizeEntity } from 'modules/relationMapV2/components/OrderFocus/normalize';

const defaultState = [];
export function useHits(initialState: Object = defaultState) {
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

export function useEntities(
  initialState: RelationMapEntities = {
    orders: [],
    entities: {},
  }
) {
  const [mapping, setMapping] = useState<RelationMapEntities>(initialState);
  const initMapping = (newMapping: RelationMapEntities) => {
    if (!isEquals(newMapping, mapping)) {
      setMapping(newMapping);
    }
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
  return { mapping, initMapping, checkRemoveEntities };
}

export const Entities = createContainer(useEntities);
