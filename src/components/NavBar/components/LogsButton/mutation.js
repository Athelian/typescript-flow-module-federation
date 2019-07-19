// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const timelineReadByEntity = gql`
  mutation timelineRead($entity: EntityInput!) {
    timelineRead(entity: $entity) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default timelineReadByEntity;
