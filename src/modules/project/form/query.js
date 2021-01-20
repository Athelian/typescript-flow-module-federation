// @flow
import gql from 'graphql-tag';
import {
  userAvatarFragment,
  tagFragment,
  productCardFragment,
  productProviderCardFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  taskCountFragment,
  sizeFragment,
  productProviderPackagingFragment,
  ownedByFragment,
} from 'graphql';
import { projectFormQueryFragment } from 'graphql/project/fragment';

export const projectFormQuery = gql`
  query projectFormQuery($id: ID!) {
    project(id: $id) {
      ...projectFormQueryFragment
    }
  }

  ${projectFormQueryFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${orderCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${itemCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${taskCountFragment}
  ${sizeFragment}
  ${productProviderPackagingFragment}
  ${ownedByFragment}
`;

export default projectFormQuery;
