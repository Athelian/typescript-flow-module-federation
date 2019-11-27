// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const balanceSplitActionMutation = gql`
  mutation balanceSplitActionMutation($ids: [ID!]!) {
    batchBalanceSplitMany(orderItemIds: $ids) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default balanceSplitActionMutation;
