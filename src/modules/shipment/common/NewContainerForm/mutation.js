// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const createContainerMutation = gql`
  mutation containerCreate($input: ContainerCreateInput!) {
    containerCreate(input: $input) {
      ... on Container {
        id
        shipment {
          ... on Shipment {
            id
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default createContainerMutation;
