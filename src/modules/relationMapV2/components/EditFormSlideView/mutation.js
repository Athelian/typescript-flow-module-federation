// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const createContainerMutation = gql`
  mutation containerCreate($input: ContainerCreateInput!) {
    containerCreate(input: $input) {
      ... on Container {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default createContainerMutation;
