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
} from 'graphql';

export const taskFormQuery = gql`
  query($id: ID!) {
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
`;

export default taskFormQuery;
