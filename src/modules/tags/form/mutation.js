// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const createTagMutation = gql`
  mutation tagCreate($input: TagCreateInput!) {
    tagCreate(input: $input) {
      tag {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const updateTagMutation = gql`
  mutation tagUpdate($id: ID!, $input: TagUpdateInput!) {
    tagUpdate(id: $id, input: $input) {
      tag {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;
