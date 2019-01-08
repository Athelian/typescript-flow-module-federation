import gql from 'graphql-tag';
import {
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
} from 'graphql';

const shipmentCardRMFragment = gql`
  fragment shipmentCardRMFragment on Shipment {
    id
    no
    blNo
    transportType
    batchCount
    orderItemCount
    totalVolume {
      ...metricFragment
    }
    cargoReady {
      ...timelineDateMinimalFragment
    }
    tags {
      ...tagFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    voyages {
      id
      departurePort {
        ...portFragment
      }
      arrivalPort {
        ...portFragment
      }
      departure {
        ...timelineDateMinimalFragment
      }
      arrival {
        ...timelineDateMinimalFragment
      }
    }
    containerGroups {
      id
      customClearance {
        ...timelineDateMinimalFragment
      }
      warehouseArrival {
        ...timelineDateMinimalFragment
      }
      deliveryReady {
        ...timelineDateMinimalFragment
      }
      warehouse {
        id
        name
      }
    }
  }
`;

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
          ...shipmentCardRMFragment
        }
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        ...shipmentCardRMFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
`;
