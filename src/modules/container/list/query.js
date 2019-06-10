import gql from 'graphql-tag';
import {
  containerCardWithOwnedFragment,
  containerCardFragment,
  ownedByFragment,
  imageFragment,
  tagFragment,
  metricFragment,
} from 'graphql';

export const containerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...containerCardWithOwnedFragment
      }
      page
      totalPage
    }
  }

  ${containerCardWithOwnedFragment}
  ${containerCardFragment}
  ${ownedByFragment}
  ${imageFragment}
  ${tagFragment}
  ${metricFragment}
`;

export default containerListQuery;
