import { getByPathWithDefault as get } from 'utils/fp';
import {
  batchSimpleSplitMutation,
  batchBalanceSplitMutaion,
  batchEqualSplitMutaion,
} from '../mutation';
import { createMutationRequest } from '../action';

export const SIMPLE = 0;
export const EQUALLY = 1;
export const BALANCE = 2;

const getPrecision = quantityType => {
  switch (quantityType) {
    default:
    case 'integer':
      return 0;
    case 'double':
      return 1;
  }
};

export const getSplitResult = (results, splitType) => {
  const splitResult = results.reduce((obj, result) => {
    const { refId, data } = result;
    const newBatches = get([], `${splitType}.batches`, data);
    const newBatchIds = newBatches.map(d => ({ id: d.id }));
    return Object.assign(obj, {
      [refId]: newBatchIds,
    });
  }, {});
  return splitResult;
};

export const getSplitFocus = (results, splitType) => {
  const splitFocus = results.reduce((obj, result) => {
    const { data } = result;
    const newBatches = get([], `${splitType}.batches`, data);
    const newBatchIdObj = newBatches.reduce(
      (batchObj, batch) => Object.assign(batchObj, { [batch.id]: true }),
      {}
    );
    return Object.assign(obj, newBatchIdObj);
  }, {});
  return splitFocus;
};

export const simpleSplit = async (client, target, data) => {
  const mutationRequest = createMutationRequest(client);
  const { batch } = target;
  const batchIds = Object.keys(batch);
  const requests = batchIds.map(batchId => {
    const currentBatch = batch[batchId];
    const request = mutationRequest(
      {
        mutation: batchSimpleSplitMutation,
        variables: {
          id: batchId,
          input: {
            quantity: +data.quantity,
          },
        },
      },
      get('', 'orderItem.id', currentBatch)
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const equallySplit = async (client, target, data) => {
  const mutationRequest = createMutationRequest(client);
  const { batch } = target;
  const batchIds = Object.keys(batch);
  const requests = batchIds.map(batchId => {
    const currentBatch = batch[batchId];
    const request = mutationRequest(
      {
        mutation: batchEqualSplitMutaion,
        variables: {
          id: batchId,
          input: {
            precision: getPrecision(data.quantityType),
            divideBy: +data.quantity,
          },
        },
      },
      get('', 'orderItem.id', currentBatch)
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const balanceSplit = async (client, target) => {
  const mutationRequest = createMutationRequest(client);
  const { orderItem } = target;
  const orderItemIds = Object.keys(orderItem);
  const requests = orderItemIds.map(orderItemId => {
    const request = mutationRequest(
      {
        mutation: batchBalanceSplitMutaion,
        variables: { orderItemId },
      },
      orderItemId
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const getSplitFunction = type => {
  switch (type) {
    default:
    case SIMPLE: {
      return simpleSplit;
    }
    case EQUALLY: {
      return equallySplit;
    }
    case BALANCE: {
      return balanceSplit;
    }
  }
};

export const getSplitType = type => {
  switch (type) {
    default:
    case SIMPLE: {
      return 'batchSimpleSplit';
    }
    case EQUALLY: {
      return 'batchEqualSplit';
    }
    case BALANCE: {
      return 'batchBalanceSplit';
    }
  }
};

export default null;
