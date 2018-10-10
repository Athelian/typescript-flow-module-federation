// @flow
import gql from 'graphql-tag';
import {
  orderFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  orderCardFragment,
} from 'graphql';

export const orderFormQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderFormFragment
    }
  }

  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
`;

export default orderFormQuery;
