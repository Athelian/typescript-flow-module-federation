import gql from 'graphql-tag';
import {
  documentFormFragment,
  userAvatarFragment,
  ownedByFragment,
  orderCardFragment,
  itemCardFragment,
  shipmentCardFragment,
  productProviderCardFragment,
  milestoneCardFragment,
  partnerNameFragment,
  priceFragment,
  tagFragment,
  metricFragment,
  portFragment,
  timelineDateMinimalFragment,
  imageFragment,
  productProviderPackagingFragment,
  sizeFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

const documentQuery = gql`
  query documentQuery($id: ID!) {
    file(id: $id) {
      ...documentFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${documentFormFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${orderCardFragment}
  ${itemCardFragment}
  ${shipmentCardFragment}
  ${productProviderCardFragment}
  ${milestoneCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${tagFragment}
  ${metricFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${imageFragment}
  ${productProviderPackagingFragment}
  ${sizeFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default documentQuery;
