import gql from 'graphql-tag';
import { tagCardFragment, ownedByFragment } from 'graphql';

export const tagsQuery = gql`
  query tags($filterBy: TagFilterInput, $sortBy: TagSortInput, $page: Int!, $perPage: Int!) {
    tags(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...tagCardFragment
        ... on Tag {
          ownedBy {
            ...ownedByFragment
          }
        }
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${tagCardFragment}
  ${ownedByFragment}
`;

export default tagsQuery;
