// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const productProviderTimelineQuery = gql`
  query productProviderTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    productProvider(id: $id) {
      ... on ProductProvider {
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

export default productProviderTimelineQuery;
