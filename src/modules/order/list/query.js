import gql from 'graphql-tag';
import {
  orderCardFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
} from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: OrderFilterInput, $sort: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...orderCardFragment
      }
      page
      totalPage
    }
  }

  ${orderCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${userAvatarFragment}
`;

export default orderListQuery;
