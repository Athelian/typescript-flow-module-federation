// @flow
import gql from 'graphql-tag';
import apolloClient from 'apollo';
import { badRequestFragment, forbiddenFragment } from 'graphql';
import { findShipmentIdByBatch, findOrderIdsByShipment } from 'modules/relationMapV2/helpers';

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

export const moveBatchesToShipment = ({
  batchIds,
  shipment,
  entities,
  orderIds,
  viewer,
}: {
  batchIds: Array<string>,
  orderIds: Array<string>,
  shipment: Object,
  entities: Object,
  viewer: string,
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
    .then(result => {
      const parentOrderIds = findOrderIdsByShipment({
        viewer,
        entities,
        shipmentId: shipment.id,
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

export default moveBatchesToShipment;
