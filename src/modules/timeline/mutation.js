// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment, notFoundFragment } from 'graphql';
import { commentFragment } from './query';

export const commentCreateMutation = gql`
  mutation commentCreate($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      ...commentFragment
      ...badRequestFragment
    }
  }

  ${commentFragment}
  ${badRequestFragment}
`;

export const commentUpdateMutation = gql`
  mutation commentUpdate($id: ID!, $input: CommentUpdateInput!) {
    commentUpdate(id: $id, input: $input) {
      ...commentFragment
      ...badRequestFragment
    }
  }

  ${commentFragment}
  ${badRequestFragment}
`;

export const commentDeleteMutation = gql`
  mutation commentDelete($id: ID!) {
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

export const messagePreferencesMutation = gql`
  mutation messagePreferencesUpdate($input: MessagePreferencesInput!) {
    messagePreferencesUpdate(input: $input) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;
