// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment, notFoundFragment } from 'graphql';

export const eventCommentCreateMutation = gql`
  mutation eventCommentCreate($input: EventCommentCreateInput!) {
    eventCommentCreate(input: $input) {
      ... on Event {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const eventCommentUpdateMutation = gql`
  mutation eventCommentUpdate($id: ID!, $input: EventCommentUpdateInput!) {
    eventCommentUpdate(id: $id, input: $input) {
      ... on Event {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const eventCommentDeleteMutation = gql`
  mutation eventCommentDelete($id: ID!) {
    eventCommentDelete(id: $id) {
      ...forbiddenFragment
      ...notFoundFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
  ${notFoundFragment}
`;
