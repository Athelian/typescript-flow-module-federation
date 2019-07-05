// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const projectTimelineQuery = gql`
  query projectTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    project(id: $id) {
      ... on Project {
        id
        timeline {
          entries(page: $page, perPage: $perPage) {
            nodes {
              ...commentFragment
              ...eventFragment
            }
            page
            totalPage
          }
        }
      }
    }
  }

  ${eventFragment}
  ${commentFragment}
`;

export default projectTimelineQuery;
