// @flow
import gql from 'graphql-tag';
import {
  containerCardFragment,
  forbiddenFragment,
  imageFragment,
  metricFragment,
  tagFragment,
} from 'graphql';

export const containersQuery = gql`
  query containers(
    $filterBy: ContainerFilterInput
    $sortBy: ContainerSortInput
    $page: Int!
    $perPage: Int!
  ) {
    containers(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...containerCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${containerCardFragment}
  ${metricFragment}
  ${imageFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export const containersByIDsQuery = gql`
  query containersByIDs($ids: [ID!]!) {
    containersByIDs(ids: $ids) {
      ... on Container {
        id
        no
      }
    }
  }
`;
