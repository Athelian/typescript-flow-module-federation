import gql from 'graphql-tag';
import {
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  priceFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
} from 'graphql';

export const batchCardRMFragment = gql`
  fragment batchCardRMFragment on Batch {
    id
    archived
    no
    latestQuantity
    tags {
      ...tagFragment
    }
    totalVolume {
      ...metricFragment
    }
    deliveredAt
    shipment {
      ... on Shipment {
        id
      }
    }
    container {
      ... on Container {
        id
      }
    }
    todo {
      completedCount
      inProgressCount
      remainingCount
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
  }
`;

export const orderCardRMFragment = gql`
  fragment orderCardRMFragment on Order {
    id
    archived
    poNo
    currency
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    todo {
      completedCount
      inProgressCount
      remainingCount
    }
    exporter {
      ... on Group {
        id
        name
      }
    }
    tags {
      ...tagFragment
    }
    orderItems {
      ... on OrderItem {
        id
        archived
        no
        quantity
        todo {
          completedCount
          inProgressCount
          remainingCount
          tasks {
            ...taskFormInSlideViewFragment
          }
        }
        tags {
          ...tagFragment
        }
        price {
          ...priceFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            product {
              ... on Product {
                id
                name
                serial
                files {
                  ... on File {
                    id
                    pathSmall: path(preset: Small)
                  }
                }
              }
            }
            exporter {
              ... on Group {
                id
                name
              }
            }
          }
        }
        batches {
          ...batchCardRMFragment
        }
      }
    }
    shipments {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            container {
              ... on Container {
                id
              }
            }
            orderItem {
              ... on OrderItem {
                id
                order {
                  ... on Order {
                    id
                  }
                }
              }
            }
          }
        }
      }
      ...shipmentCardRMFragment
    }
  }
`;

export const shipmentCardRMFragment = gql`
  fragment shipmentCardRMFragment on Shipment {
    id
    archived
    no
    blNo
    booked
    transportType
    batchCount
    orderItemCount
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    totalVolume {
      ...metricFragment
    }
    containerTypeCounts {
      containerType
      count
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
    todo {
      completedCount
      inProgressCount
      remainingCount
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
        vesselName
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
    containers {
      ... on Container {
        id
        warehouseArrivalAgreedDate
        warehouseArrivalAgreedDateApprovedAt
        warehouseArrivalActualDate
        warehouseArrivalActualDateApprovedAt
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
    batches {
      ... on Batch {
        id
        container {
          ... on Container {
            id
          }
        }
        orderItem {
          ... on OrderItem {
            id
            order {
              ... on Order {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderCardRMFragment
    }
  }

  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${batchCardRMFragment}
  ${orderCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
`;

export const shipmentDetailQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      ...shipmentCardRMFragment
    }
  }

  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
`;

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardRMFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${batchCardRMFragment}
  ${orderCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ShipmentFilterInput, $sortBy: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Shipment {
          id
          batches {
            ... on Batch {
              id
              container {
                ... on Container {
                  id
                }
              }
              orderItem {
                ... on OrderItem {
                  id
                  order {
                    ... on Order {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        ...shipmentCardRMFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
`;
