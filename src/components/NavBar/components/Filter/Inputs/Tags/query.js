// @flow
import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const tagsByIDsQuery = gql`
  query tagsByIDs($ids: [ID!]!) {
    tagsByIDs(ids: $ids) {
      ... on Tag {
        id
        name
        color
      }
    }
  }
`;
