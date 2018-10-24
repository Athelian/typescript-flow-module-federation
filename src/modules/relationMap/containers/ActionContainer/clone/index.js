import update from 'immutability-helper';
import { getByPathWithDefault as get } from 'utils/fp';

export { cloneOrder, cloneOrderItem, cloneBatch, cloneShipment } from './cloneTarget';
export { cloneTree } from './cloneTree';

export const createMutationRequest = client => async (mutationData, refId) =>
  new Promise(resolve => {
    client.mutate(mutationData).then(result => {
      resolve({ data: result.data, refId });
    });
  });

export const initResultObj = ids => ({
  itemId: {},
  refId: ids.reduce(
    (id, refId) => ({
      ...id,
      [refId]: {},
    }),
    {}
  ),
});

export const formatResult = (responses, idPath, ids) => {
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
