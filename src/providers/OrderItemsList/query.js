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
        productProvider {
          id
          product {
            id
            name
            serial
            files {
              id
              path
            }
          }
          exporter {
            id
            name
          }
          supplier {
            id
            name
          }
        }
      }
    }
  }
`;

export default orderListQuery;
