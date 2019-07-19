// @flow
import { upperFirst } from 'lodash';
import gql from 'graphql-tag';

export const unreadTimelineByEntity = (entityType: string) => gql`
  query unreadTimelineByEntity($id: ID!) {
    ${entityType}(id: $id) {
      ... on ${upperFirst(entityType)} {
          id
          timeline {
          ... on Timeline {
            unreadCount
          }
        }
      }
    }
  }
`;

export default unreadTimelineByEntity;
