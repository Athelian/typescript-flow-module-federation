// @flow
import gql from 'graphql-tag';

import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
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
  ${shipmentCardFragment}
  ${orderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
`;

export default taskFormQuery;
