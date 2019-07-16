// @flow
import gql from 'graphql-tag';
import {
  orderCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
  taskCountFragment,
} from 'graphql';

export const shipmentFormOrderQuery = gql`
  query shipmentFormOrderQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                order {
                  ...orderCardFragment
                }
              }
            }
          }
        }
      }
    }
  }

  ${orderCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${userAvatarFragment}
  ${taskCountFragment}
`;

export default shipmentFormOrderQuery;
