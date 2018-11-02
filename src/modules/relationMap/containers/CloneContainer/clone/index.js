// @flow
import update from 'immutability-helper';
import { getByPathWithDefault as get } from 'utils/fp';

import { cloneTarget } from './cloneTarget';
import { cloneTree } from './cloneTree';

export const createMutationRequest = (client: any) => async (
  mutationData: Object,
  refId?: string
) =>
  new Promise(resolve => {
    client.mutate(mutationData).then(result => {
      resolve({ data: result.data, refId });
    });
  });

export const initResultObj = (ids: Array<string>) => ({
  itemId: {},
  refId: ids.reduce(
    (id, refId) => ({
      ...id,
      [refId]: {},
    }),
    {}
  ),
});

export const formatResult = (responses: Array<Object>, idPath: string, ids: Array<string>) => {
  const formattedResult = responses.reduce((result, batch) => {
    const { data, refId } = batch;
    const id = get(null, idPath, data);
    if (id) {
      return update(result, {
        itemId: { $merge: { [id]: true } },
        refId: { [refId]: { $merge: { [id]: true } } },
      });
    }
    return result;
  }, initResultObj(ids));
  return formattedResult;
};

export const getCloneFunction = (focusMode: string) => {
  switch (focusMode) {
    default:
    case 'TARGET':
      return cloneTarget;
    case 'TARGET_TREE':
      return cloneTree;
  }
};
