// @flow
import * as React from 'react';
import update from 'immutability-helper';
import { getByPathWithDefault } from 'utils/fp';
import { createBatchMutation } from 'modules/batch/form/mutation';

type State = {
  result: Object,
};

type Props = {
  children: Function,
};

const createMutationRequest = client => async (mutationData, refId) =>
  new Promise(resolve => {
    client.mutate(mutationData).then(result => {
      resolve({ data: result.data, refId });
    });
  });

const initResultObj = ids => ({
  itemId: {},
  refId: ids.reduce(
    (id, refId) => ({
      ...id,
      [refId]: {},
    }),
    {}
  ),
});

const formatResult = (responses, idPath, ids) => {
  const formattedResult = responses.reduce((result, batch) => {
    const { data, refId } = batch;
    const id = getByPathWithDefault(null, idPath, data);
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
class ActionContainer extends React.Component<Props, State> {
  state = {
    result: {},
  };

  setResult = (result: Object) => {
    this.setState({
      result,
    });
  };

  clone = async (client: any, target: Object) => {
    const mutationRequest = createMutationRequest(client);
    const { batch } = target;
    const batchIds = Object.keys(batch);
    const batchRequests = batchIds.map(batchId => {
      const currentBatch = batch[batchId];
      const request = mutationRequest(
        {
          mutation: createBatchMutation,
          variables: {
            input: {
              no: `[clone] ${currentBatch.no}`,
              quantity: currentBatch.quantity,
              orderItemId: currentBatch.orderItem && currentBatch.orderItem.id,
            },
          },
        },
        batchId
      );
      return request;
    });
    const newBatches = await Promise.all(batchRequests);
    const batchResult = formatResult(newBatches, 'batchCreate.batch.id', batchIds);

    return {
      batch: batchResult,
    };
  };

  render() {
    const { result } = this.state;
    const { children } = this.props;
    return children({
      result,
      setResult: this.setResult,
      clone: this.clone,
    });
  }
}

export default ActionContainer;
