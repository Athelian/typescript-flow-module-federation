import gql from 'graphql-tag';
import {
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  priceFragment,
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  taskCountFragment,
} from 'graphql';

export const productProviderRMFragment = gql`
  fragment productProviderRMFragment on ProductProvider {
    id
    name
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
        importer {
          ... on Organization {
            id
            name
          }
        }
      }
    }
    exporter {
      ... on Organization {
        id
        name
      }
    }
    supplier {
      ... on Organization {
        id
        name
      }
    }
  }
`;

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
      taskCount {
        ...taskCountFragment
      }
      tasks {
        ...taskWithoutParentInfoFragment
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
      taskCount {
        ...taskCountFragment
      }
    }
    exporter {
      ... on Organization {
        id
        name
      }
    }
    importer {
      ... on Organization {
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
          taskCount {
            ...taskCountFragment
          }
          tasks {
            ...taskWithoutParentInfoFragment
          }
        }
        tags {
          ...tagFragment
        }
        price {
          ...priceFragment
        }
        productProvider {
          ...productProviderRMFragment
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
                productProvider {
                  ...productProviderRMFragment
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
    totalPackageQuantity
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
    todo {
      taskCount {
        ...taskCountFragment
      }
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
            productProvider {
              ...productProviderRMFragment
            }
          }
        }
      }
    }
  }
`;

export const orderDetailQuery = gql`
  query orderDetailQuery($id: ID!) {
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
  ${productProviderRMFragment}
`;

export const shipmentDetailQuery = gql`
  query shipmentDetailQuery($id: ID!) {
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
  ${taskCountFragment}
  ${productProviderRMFragment}
`;

export const orderFocusedListQuery = gql`
  query orderFocusedListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
  ${productProviderRMFragment}
`;

export const shipmentListQuery = gql`
  query shipmentListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
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
                  productProvider {
                    ...productProviderRMFragment
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
  ${taskCountFragment}
  ${productProviderRMFragment}
`;
