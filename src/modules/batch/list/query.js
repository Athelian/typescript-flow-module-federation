// @flow
import gql from 'graphql-tag';
import {
  batchCardWithOwnedFragment,
  batchCardFragment,
  ownedByFragment,
  metricFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  taskCountFragment,
  partnerNameFragment,
  forbiddenFragment,
} from 'graphql';

export const batchListQuery = gql`
  query batchListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...batchCardWithOwnedFragment
        ... on Followed {
          notificationUnseenCount
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${batchCardWithOwnedFragment}
  ${batchCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export default batchListQuery;
