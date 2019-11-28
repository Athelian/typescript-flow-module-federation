// @flow
import gql from 'graphql-tag';
import {
  productProviderCardFragment,
  partnerNameFragment,
  priceFragment,
  tagFragment,
  imageFragment,
  taskCountFragment,
  productProviderPackagingFragment,
  metricFragment,
  sizeFragment,
  forbiddenFragment,
} from 'graphql';

export const syncPackagingProductProviderQuery = gql`
  query syncPackagingProductProviderQuery($id: ID!) {
    productProvider(id: $id) {
      ...productProviderCardFragment
      ...forbiddenFragment
    }
  }

  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${tagFragment}
  ${imageFragment}
  ${taskCountFragment}
  ${productProviderPackagingFragment}
  ${metricFragment}
  ${sizeFragment}
  ${forbiddenFragment}
`;

export default syncPackagingProductProviderQuery;
