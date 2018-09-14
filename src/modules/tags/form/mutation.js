// @flow
import gql from 'graphql-tag';

export const createTagMutation = gql`
  mutation tagCreate($input: TagCreateInput!) {
    tagCreate(input: $input) {
      tag {
        id
      }
    }
  }
`;

export const updateTagMutation = gql`
  mutation tagUpdate($id: ID!, $input: TagUpdateInput!) {
    tagUpdate(id: $id, input: $input) {
      tag {
        name
        description
        color
        entityTypes
      }
    }
  }
`;
