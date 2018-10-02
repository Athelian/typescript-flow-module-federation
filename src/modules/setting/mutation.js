// @flow
import gql from 'graphql-tag';

export const logOutMutation = gql`
  mutation {
    logout
  }
`;

export const notificationSeeAllMutation = gql`
  mutation {
    notificationSeeAll
  }
`;

export default logOutMutation;
