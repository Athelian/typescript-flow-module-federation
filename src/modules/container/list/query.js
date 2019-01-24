import gql from 'graphql-tag';
import { containerCardFragment, imageFragment, tagFragment, metricFragment } from 'graphql';

export const containerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...containerCardFragment
      }
      page
      totalPage
    }
  }

  ${containerCardFragment}
  ${imageFragment}
  ${tagFragment}
  ${metricFragment}
`;

export default containerListQuery;
