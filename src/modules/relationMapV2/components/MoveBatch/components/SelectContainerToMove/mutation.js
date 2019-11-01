// @flow
import gql from 'graphql-tag';
import apolloClient from 'apollo';
import { badRequestFragment, forbiddenFragment } from 'graphql';
import { findShipmentIdByBatch, findOrderIdsByContainer } from 'modules/relationMapV2/helpers';

const updateBatchesMutation = gql`
  mutation batchUpdateMany($batches: [BatchUpdateWrapperInput!]!) {
    batchUpdateMany(batches: $batches) {
      ... on Batch {
        id
        shipment {
          ... on Shipment {
            id
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const moveBatchesToContainer = ({
  batchIds,
  container,
  entities,
  orderIds,
  viewer,
}: {
  batchIds: Array<string>,
  orderIds: Array<string>,
  container: Object,
  entities: Object,
  viewer: string,
}) => {
  const batches = [];
  batchIds.forEach(batchId => {
    const batch = entities?.batches?.[batchId];
    if (batch?.container !== container.id) {
      batches.push({
        id: batchId,
        input: {
          containerId: container.id,
          shipmentId: container.shipment.id,
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
    .then(result => {
      const parentOrderIds = findOrderIdsByContainer({
        viewer,
        entities,
        containerId: container.id,
      });
      const shipmentIds = batchIds.map(batchId => findShipmentIdByBatch(batchId, entities));
      (result.data?.batchUpdateMany ?? []).forEach(batch => {
        const shipmentId = batch?.shipment?.id;
        if (!shipmentIds.includes(shipmentId)) {
          shipmentIds.push(shipmentId);
        }
      });
      const ids = {
        orderIds: [...parentOrderIds, ...orderIds].filter(Boolean),
        shipmentIds: shipmentIds.filter(Boolean),
      };
      return Promise.resolve(ids);
    });
};

export default moveBatchesToContainer;
