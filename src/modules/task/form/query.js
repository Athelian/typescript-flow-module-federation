// @flow
import gql from 'graphql-tag';

import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
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
  ${orderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
`;

export default taskFormQuery;
