// @flow
import { useState } from 'react';
import type { Hit } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { normalizeEntity } from 'modules/relationMapV2/components/OrderFocus/normalize';

const defaultState = [];
export function useHits(initialState: Object = defaultState) {
  const [hits, setHits] = useState<Array<Hit>>(initialState);
  const matches = normalizeEntity({ hits });
  return { hits, matches, setHits };
}

export const Hits = createContainer(useHits);
