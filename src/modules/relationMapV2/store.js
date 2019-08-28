// @flow
import { useState } from 'react';
import type { Hit, OrderPayload } from 'generated/graphql';
import { createContainer } from 'unstated-next';
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
  orders: Array<OrderPayload>,
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
  return { mapping, initMapping };
}

export const Entities = createContainer(useEntities);
