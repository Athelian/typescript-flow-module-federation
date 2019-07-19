// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const timelineReadByEntity = gql`
  mutation timelineRead($id: ID!) {
    timelineRead(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default timelineReadByEntity;
