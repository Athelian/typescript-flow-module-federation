// @flow
import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        id
        price {
          amount
          currency
        }
        quantity
        batches {
          id
          quantity
        }
        order {
          id
          poNo
        }
        productProvider {
          id
          exporter {
            id
            name
          }
          supplier {
            id
            name
          }
          product {
            id
            name
            serial
            tags {
              id
              name
              color
              description
            }
          }
        }
      }
    }
  }
`;

export default orderListQuery;
