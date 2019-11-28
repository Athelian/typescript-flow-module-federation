// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const orderItemCreateActionMutation = gql`
  mutation orderItemCreateActionMutation($inputs: [OrderItemCreateInput!]!) {
    orderItemCreateMany(inputs: $inputs) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default orderItemCreateActionMutation;
