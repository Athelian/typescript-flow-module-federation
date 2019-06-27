// @flow
import gql from 'graphql-tag';

export const exportReadySubscription = gql`
  subscription exportReady($exportId: ID!) {
    exportReady(id: $exportId) {
      ... on File {
        path
      }
    }
  }
`;

export default exportReadySubscription;
