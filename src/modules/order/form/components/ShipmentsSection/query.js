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

export const orderFormShipmentsQuery = gql`
  query orderFormShipmentsQuery($id: ID!) {
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

export default orderFormShipmentsQuery;
