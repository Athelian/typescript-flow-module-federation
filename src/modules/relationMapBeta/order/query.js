import gql from 'graphql-tag';
import { tagFragment } from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        poNo
        totalOrdered
        totalBatched
        totalShipped
        orderItemCount
        batchCount
        batchShippedCount
        shipmentCount
        tags {
          ...tagFragment
        }
        orderItems {
          id
          quantity
          productProvider {
            product {
              name
              serial
            }
          }
          batches {
            id
            no
            quantity
            totalAdjusted
            tags {
              ...tagFragment
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
          tags {
            ...tagFragment
          }
        }
      }
      page
      totalPage
    }
  }

  ${tagFragment}
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        no
        totalVolume {
          value
          metric
        }
        tags {
          ...tagFragment
        }
      }
      page
      totalPage
    }
  }

  ${tagFragment}
`;
