import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: OrderFilterInput, $sort: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        poNo
        currency
        exporter {
          id
          name
        }
        tags {
          id
          name
          color
        }
        orderItems {
          id
          quantity
          price {
            amount
            currency
          }
          batches {
            id
            quantity
            batchAdjustments {
              id
              quantity
            }
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
