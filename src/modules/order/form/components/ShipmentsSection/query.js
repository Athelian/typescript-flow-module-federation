// @flow
import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  metricFragment,
  taskCountFragment,
  userAvatarFragment,
  partnerNameFragment,
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
  ${userAvatarFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${metricFragment}
  ${taskCountFragment}
`;

export default orderFormShipmentsQuery;
