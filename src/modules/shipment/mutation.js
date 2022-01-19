// @flow
import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const updateShipmentViewStateMutation = gql`
  mutation viewState($input: ViewStateUpdateInput!) {
    viewState(input: $input) {
      ... on ViewState {
        id
        type
        filterSort
      }
    }
  }
`;
