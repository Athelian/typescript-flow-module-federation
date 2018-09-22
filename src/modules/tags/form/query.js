// @flow
import gql from 'graphql-tag';

export const tagDetailFragment = gql`
  fragment tagDetailFragment on Tag {
    name
    description
    color
    entityTypes
    id
  }
`;
export const tagDetailQuery = gql`
  query($id: ID!) {
    tag(id: $id) {
      ...tagDetailFragment
    }
  }
  ${tagDetailFragment}
`;

export default tagDetailQuery;
