// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from 'graphql/userList/fragment';

export const createCommentMutation = gql`
  mutation createComment($entityId: ID!, $entityType: String!, $input: CommentInput!) {
    createComment(id: $entityId, typename: $entityType, input: $input) {
      id
      body
      user {
        ...userListFields
      }
      createdAt
      updatedAt
    }
  }

  ${userListFieldsFragment}
`;

export const updateCommentMutation = gql`
  mutation updateComment($id: ID!, $input: CommentInput!) {
    updateComment(id: $id, input: $input) {
      id
      body
      user {
        ...userListFields
      }
      createdAt
      updatedAt
    }
  }

  ${userListFieldsFragment}
`;

export const deleteCommentMutation = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;
