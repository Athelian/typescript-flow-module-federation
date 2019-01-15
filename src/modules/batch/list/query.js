// @flow
import gql from 'graphql-tag';
import {
  batchCardFragment,
  metricFragment,
  orderCardFragment,
  userAvatarFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
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

  ${orderCardFragment}
  ${userAvatarFragment}
  ${batchCardFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
`;

export default batchListQuery;
