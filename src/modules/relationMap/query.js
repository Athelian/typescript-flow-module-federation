import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        poNo
        issuedAt
        exporter {
          id
          name
        }
        updatedAt
        createdAt
        orderItems {
          id
          quantity
          batches {
            id
            no
            quantity
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
