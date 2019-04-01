// @flow
import gql from 'graphql-tag';
import {
  taskFormInSlideViewFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  todoFragment,
} from 'graphql';

export const editableTaskListQuery = gql`
  query($orderIds: [ID!]!, $batchIds: [ID!]!, $shipmentIds: [ID!]!) {
    orders: ordersByIDs(ids: $orderIds) {
      ... on Order {
        id
        ...orderCardFragment
        todo {
          tasks {
            ...taskFormInSlideViewFragment
          }
        }
      }
    }
    batches: batchesByIDs(ids: $batchIds) {
      ... on Batch {
        id
        ...batchCardFragment
        todo {
          tasks {
            ...taskFormInSlideViewFragment
          }
        }
      }
    }
    shipments: shipmentsByIDs(ids: $shipmentIds) {
      ... on Shipment {
        id
        ...shipmentCardFragment
        todo {
          tasks {
            ...taskFormInSlideViewFragment
          }
        }
      }
    }
  }

  ${taskFormInSlideViewFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${partnerNameFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${orderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
`;

export default editableTaskListQuery;
