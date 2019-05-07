// @flow
import gql from 'graphql-tag';
import {
  batchCardFragment,
  metricFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  todoFragment,
} from 'graphql';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: BatchFilterInput, $sortBy: BatchSortInput) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...batchCardFragment
      }
      page
      totalPage
    }
  }

  ${batchCardFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${todoFragment}
`;

export default batchListQuery;
