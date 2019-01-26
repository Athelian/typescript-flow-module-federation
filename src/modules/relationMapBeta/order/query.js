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
      ... on Voyage {
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
    }
    containerGroups {
      ... on ContainerGroup {
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
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
  }
`;

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Order {
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
            ... on OrderItem {
              id
              quantity
              productProvider {
                ... on ProductProvider {
                  id
                  product {
                    ... on Product {
                      id
                      name
                      serial
                    }
                  }
                }
              }
              batches {
                ... on Batch {
                  id
                  no
                  quantity
                  totalAdjusted
                  tags {
                    ...tagFragment
                  }
                  packageVolume {
                    ...metricFragment
                  }
                }
              }
            }
          }
          shipments {
            ... on Shipment {
              id
              batches {
                ... on Batch {
                  id
                }
              }
            }
            ...shipmentCardRMFragment
          }
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
        ... on Shipment {
          id
        }
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
