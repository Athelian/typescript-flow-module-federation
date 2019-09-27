// @flow
import gql from 'graphql-tag';
import apolloClient from 'apollo';
import { findKey } from 'lodash';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const updateBatchesMutation = gql`
  mutation batchUpdateMany($batches: [BatchUpdateWrapperInput!]!) {
    batchUpdateMany(batches: $batches) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const moveBatchesToShipment = ({
  batchIds,
  shipment,
  entities,
  orderIds,
}: {
  batchIds: Array<string>,
  orderIds: Array<string>,
  shipment: Object,
  entities: Object,
}) => {
  const batches = [];
  batchIds.forEach(batchId => {
    const batch = entities?.batches?.[batchId];
    if (batch?.shipment !== shipment.id) {
      batches.push({
        id: batchId,
        input: {
          shipmentId: shipment.id,
          containerId: null,
        },
      });
    }
  });

  return apolloClient
    .mutate({
      mutation: updateBatchesMutation,
      variables: {
        batches,
      },
    })
    .then(() => {
      const parentOrderId = findKey(entities.orders, currentOrder => {
        return (currentOrder.shipments || []).includes(shipment.id);
      });
      return Promise.resolve([parentOrderId, ...orderIds].filter(Boolean));
    });
};

export default moveBatchesToShipment;
