// @flow
import gql from 'graphql-tag';

import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  productCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  todoFragment,
  productProviderCardFragment,
  sizeFragment,
  ownedByFragment,
} from 'graphql';

export const taskFormQuery = gql`
  query taskFormQuery($id: ID!) {
    task(id: $id) {
      ...taskFormFragment
    }
  }

  ${taskFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${productCardFragment}
  ${shipmentCardFragment}
  ${itemCardFragment}
  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
  ${sizeFragment}
  ${ownedByFragment}
`;

export default taskFormQuery;
