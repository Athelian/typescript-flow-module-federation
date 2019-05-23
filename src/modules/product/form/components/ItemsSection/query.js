import gql from 'graphql-tag';
import { itemCardFragment, tagFragment, priceFragment, imageFragment, todoFragment } from 'graphql';

export const itemsInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on OrderItem {
          ...itemCardFragment
        }
      }
      totalCount
      page
      totalPage
    }
  }

  ${itemCardFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${todoFragment}
`;

export default itemsInProductQuery;
