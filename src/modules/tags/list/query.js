import gql from 'graphql-tag';
import { tagCardFragment } from 'graphql';

export const tagsQuery = gql`
  query tags($filterBy: TagFilterInput, $sortBy: TagSortInput, $page: Int!, $perPage: Int!) {
    tags(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...tagCardFragment
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${tagCardFragment}
`;

export default tagsQuery;
