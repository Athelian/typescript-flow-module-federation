// @flow
import gql from 'graphql-tag';
import {
  metricFragment,
  tagFragment,
  badRequestFragment,
  userAvatarFragment,
  timelineDateMinimalFragment,
  portFragment,
} from 'graphql';
import { batchCardRMFragment, shipmentCardRMFragment } from 'modules/relationMapBeta/order/query';

export const cloneBatchMutation = gql`
  mutation batchClone($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ...batchCardRMFragment
      ...badRequestFragment
    }
  }

  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${badRequestFragment}
`;

export const cloneShipmentMutation = gql`
  mutation shipmentClone($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentClone(id: $id, input: $input) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
          }
        }
      }
      ...shipmentCardRMFragment
      ...badRequestFragment
    }
  }

  ${shipmentCardRMFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${badRequestFragment}
`;
