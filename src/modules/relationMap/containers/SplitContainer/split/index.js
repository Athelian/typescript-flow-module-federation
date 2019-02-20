// @flow
import { getByPathWithDefault as get } from 'utils/fp';
import { SIMPLE, EQUALLY, BALANCE } from 'modules/relationMap/constants';
import { createMutationRequest } from 'modules/relationMap/containers/action';
import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import {
  batchSimpleSplitMutation,
  batchBalanceSplitMutaion,
  batchEqualSplitMutaion,
} from '../mutation';

export const getSplitResult = (results: Array<Object>, splitType: string, target: Object) => {
  const splitResult = results.reduce((obj, result) => {
    const { refId, data } = result;
    const newBatches = get([], `${splitType}.batches`, data);
    const newBatchIds = newBatches
      .filter(newBatch => !(target.batch && target.batch[newBatch.id]))
      .map(newBatch => ({ ...newBatch, actionType: 'split' }));
    return Object.assign(obj, {
      [refId]: newBatchIds,
    });
  }, {});
  return splitResult;
};

export const getSplitFocus = (results: Array<Object>, splitType: string, target: Object) => {
  const splitFocus = results.reduce((obj, result) => {
    const { data } = result;
    const newBatches = get([], `${splitType}.batches`, data);
    const newBatchIdObj = newBatches
      .filter(newBatch => !(target.batch && target.batch[newBatch.id]))
      .reduce((batchObj, batch) => Object.assign(batchObj, { [batch.id]: batch }), {});
    return Object.assign(obj, newBatchIdObj);
  }, {});
  return splitFocus;
};

type SplitType = {
  client: any,
  target: Object,
  data: Object,
  filter: Object,
};

const updateBatchCache = (filter, type) => (store, { data: splitData }) => {
  const splitBatches = splitData[type].batches.reduce(
    (splitBatch, batchData) => Object.assign(splitBatch, { [batchData.id]: batchData }),
    {}
  );
  const query = { query: orderListQuery, variables: filter };
  const orderList = store.readQuery(query);
  const orders = get([], 'orders.nodes', orderList);
  const newOrders = orders.map(order => {
    const orderItems = order.orderItems.map(item => {
      const batches = item.batches.some(batchData => splitBatches[batchData.id])
        ? item.batches
            .filter(batchData => !splitBatches[batchData.id])
            .concat(splitData[type].batches)
        : item.batches;
      return { ...item, batches };
    });
    return { ...order, orderItems };
  });
  store.writeQuery({
    query: orderListQuery,
    variables: filter,
    data: { orders: { ...orderList.orders, nodes: newOrders } },
  });
};
export const simpleSplit = async ({ client, target, data, filter }: SplitType) => {
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
        update: updateBatchCache(filter, 'batchSimpleSplit'),
      },
      get('', 'orderItem.id', currentBatch)
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const equallySplit = async ({ client, target, data, filter }: SplitType) => {
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
            precision: 0,
            divideBy: +data.quantity,
          },
        },
        update: updateBatchCache(filter, 'batchEqualSplit'),
      },
      get('', 'orderItem.id', currentBatch)
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const balanceSplit = async ({
  client,
  target,
  filter,
}: {
  client: any,
  target: Object,
  filter: Object,
}) => {
  const mutationRequest = createMutationRequest(client);
  const { orderItem } = target;
  const orderItemIds = Object.keys(orderItem);
  const requests = orderItemIds.map(orderItemId => {
    const request = mutationRequest(
      {
        mutation: batchBalanceSplitMutaion,
        variables: { orderItemId },
        update: updateBatchCache(filter, 'batchBalanceSplit'),
      },
      orderItemId
    );
    return request;
  });
  const results = await Promise.all(requests);
  return results;
};

export const getSplitFunction = (type: string) => {
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

export const getSplitType = (type: string) => {
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
