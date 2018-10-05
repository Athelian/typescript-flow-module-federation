import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: OrderFilterInput, $sort: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        poNo
        currency
        archived
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
            shipment {
              id
            }
          }
        }
        inCharges {
          id
          firstName
          lastName
        }
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
