// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment, notFoundFragment } from 'graphql';

export const eventCommentCreateMutation = gql`
  mutation eventCommentCreate($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      ... on Comment {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const eventCommentUpdateMutation = gql`
  mutation eventCommentUpdate($id: ID!, $input: CommentUpdateInput!) {
    commentUpdate(id: $id, input: $input) {
      ... on Comment {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const eventCommentDeleteMutation = gql`
  mutation eventCommentDelete($id: ID!) {
    commentDelete(id: $id) {
      ...forbiddenFragment
      ...notFoundFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
  ${notFoundFragment}
`;
