import gql from 'graphql-tag';
import { containerCardFragment, metricFragment, tagFragment, imageFragment } from 'graphql';

export const containersInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...containerCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${containerCardFragment}
  ${imageFragment}
  ${tagFragment}
  ${metricFragment}
`;

export default containersInProductQuery;
