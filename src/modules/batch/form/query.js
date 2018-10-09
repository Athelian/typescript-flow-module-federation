// @flow
import gql from 'graphql-tag';
import {
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  filesFragment,
  partnerNameFragment,
  shipmentCardFragment,
} from 'graphql';

export const batchFormQuery = gql`
  query($id: ID!) {
    batch(id: $id) {
      ...batchFormFragment
    }
  }

  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${filesFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
`;

export default batchFormQuery;
