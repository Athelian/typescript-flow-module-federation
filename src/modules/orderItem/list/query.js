import gql from 'graphql-tag';

export const orderItemListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on OrderItem {
          id
        }
      }
      page
      totalPage
    }
  }
`;

export default orderItemListQuery;
