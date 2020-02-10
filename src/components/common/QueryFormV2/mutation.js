// @flow
import gql from 'graphql-tag';

export const notificationSeeByEntitiesMutation = gql`
  mutation notificationSeeByEntities($entities: [EntityInput!]!) {
    notificationSeeByEntities(entities: $entities)
  }
`;

export default notificationSeeByEntitiesMutation;
