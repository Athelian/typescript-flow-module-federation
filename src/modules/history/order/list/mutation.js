// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const eventCommentCreateMutation = gql`
  mutation eventCommentCreate($input: EventCommentCreateInput!) {
    eventCommentCreate(input: $input) {
      eventComment {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const eventCommentUpdateMutation = gql`
  mutation eventCommentUpdate($id: ID!, $input: EventCommentUpdateInput!) {
    eventCommentUpdate(id: $id, input: $input) {
      eventComment {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const eventCommentDeleteMutation = gql`
  mutation eventCommentDelete($id: ID!) {
    eventCommentDelete(id: $id)
  }
`;
