import gql from 'graphql-tag';
import {
  containerCardWithOwnedFragment,
  containerCardFragment,
  ownedByFragment,
  imageFragment,
  tagFragment,
  metricFragment,
  badRequestFragment,
  forbiddenFragment,
  notFoundFragment,
} from 'graphql';

export const containerListQuery = gql`
  query containerListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ContainerFilterInput
    $sortBy: ContainerSortInput
  ) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...containerCardWithOwnedFragment
        ... on Container {
          id
          shipment {
            ... on Shipment {
              exporter {
                ... on Organization {
                  id
                  name
                }
              }
            }
          }
        }
        ...badRequestFragment
        ...forbiddenFragment
        ...notFoundFragment
      }
      page
      totalPage
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
  ${notFoundFragment}
  ${containerCardWithOwnedFragment}
  ${containerCardFragment}
  ${ownedByFragment}
  ${imageFragment}
  ${tagFragment}
  ${metricFragment}
`;

export default containerListQuery;
