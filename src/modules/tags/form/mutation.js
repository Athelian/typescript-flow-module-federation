// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const createTagMutation = gql`
  mutation tagCreate($input: TagCreateInput!) {
    tagCreate(input: $input) {
      ... on Tag {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const updateTagMutation = gql`
  mutation tagUpdate($id: ID!, $input: TagUpdateInput!) {
    tagUpdate(id: $id, input: $input) {
      ... on Tag {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;
