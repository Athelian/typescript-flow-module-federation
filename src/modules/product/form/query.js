// @flow
import gql from 'graphql-tag';
import {
  productFormFragment,
  userAvatarFragment,
  tagFragment,
  imageFragment,
  partnerCardFragment,
  priceFragment,
  metricFragment,
  sizeFragment,
} from 'graphql';

export const productFormQuery = gql`
  query($id: ID!) {
    product(id: $id) {
      ...productFormFragment
    }
  }

  ${productFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
`;

export default productFormQuery;
