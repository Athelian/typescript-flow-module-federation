// @flow
import gql from 'graphql-tag';

export const tagFormFragment = gql`
  fragment tagFormFragment on Tag {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    description
    color
    entityTypes
  }
`;

export const tagCardFragment = gql`
  fragment tagCardFragment on Tag {
    id
    name
    description
    color
    entityTypes
  }
`;
