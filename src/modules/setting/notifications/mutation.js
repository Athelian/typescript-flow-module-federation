// @flow
import gql from 'graphql-tag';

export const notificationReadAllMutation = gql`
  mutation {
    notificationReadAll
  }
`;

export const notificationSeeAllMutation = gql`
  mutation {
    notificationSeeAll
  }
`;
