// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const taskTimelineQuery = gql`
  query taskTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    task(id: $id) {
      ... on Task {
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

export default taskTimelineQuery;
