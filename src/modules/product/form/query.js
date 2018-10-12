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
  productProviderFormFragment,
  metadataFragment,
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
  ${productProviderFormFragment}
  ${metadataFragment}
`;

export default productFormQuery;
