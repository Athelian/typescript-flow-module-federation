// @flow
import gql from 'graphql-tag';

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
