// @flow
import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  todoFragment,
} from 'graphql';

export const shipmentRelateOfOrder = gql`
  query shipmentRelateOfOrder($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        shipments {
          ...shipmentCardFragment
        }
      }
    }
  }

  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${todoFragment}
`;

export default shipmentRelateOfOrder;
