// @flow
import gql from 'graphql-tag';
import apolloClient from 'apollo';
import { findKey } from 'lodash';
import { badRequestFragment, forbiddenFragment } from 'graphql';
import { getByPathWithDefault } from 'utils/fp';

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

export const moveBatchesToContainer = ({
  batchIds,
  container,
  entities,
  orderIds,
}: {
  batchIds: Array<string>,
  orderIds: Array<string>,
  container: Object,
  entities: Object,
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
    .then(() => {
      const parentOrderId = findKey(entities.orders, currentOrder => {
        return (currentOrder.shipments || []).some(shipmentId =>
          getByPathWithDefault([], `shipments.${shipmentId}.containers`, entities).includes(
            container.id
          )
        );
      });
      return Promise.resolve([parentOrderId, ...orderIds].filter(Boolean));
    });
};

export default moveBatchesToContainer;
