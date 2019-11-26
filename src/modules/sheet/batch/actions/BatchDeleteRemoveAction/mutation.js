// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

export const deleteBatchActionMutation = gql`
  mutation deleteBatchActionMutation($id: ID!) {
    batchDelete(id: $id) {
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
`;

export const removeBatchFromShipmentActionMutation = gql`
  mutation removeBatchFromShipmentActionMutation($id: ID!) {
    batchUpdate(id: $id, input: { shipmentId: null }) {
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
`;

export const removeBatchFromContainerActionMutation = gql`
  mutation removeBatchFromContainerActionMutation($id: ID!) {
    batchUpdate(id: $id, input: { containerId: null }) {
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
`;
