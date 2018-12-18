import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        poNo
        totalOrdered
        totalBatched
        totalShipped
        orderItemCount
        batchCount
        batchShippedCount
        shipmentCount
        orderItems {
          id
          quantity
          batches {
            id
            no
            quantity
            batchAdjustments {
              id
              quantity
            }
          }
        }
        shipments {
          id
          no
          totalVolume {
            value
            metric
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
