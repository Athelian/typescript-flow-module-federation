import gql from 'graphql-tag';
import { tagFragment, taskCountFragment } from 'graphql';

export const productProviderNewRMFragment = gql`
  fragment productProviderNewRMFragment on ProductProvider {
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

export const batchCardNewRMFragment = gql`
  fragment batchCardNewRMFragment on Batch {
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

export const orderCardNewRMFragment = gql`
  fragment orderCardNewRMFragment on Order {
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
          ...productProviderNewRMFragment
        }
        batches {
          ...batchCardNewRMFragment
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
                  ...productProviderNewRMFragment
                }
              }
            }
          }
        }
      }
      ...shipmentCardNewRMFragment
    }
  }
`;

export const orderCardOptimiseFragment = gql`
  fragment orderCardOptimiseFragment on Order {
    id
    archived
    poNo
    orderItemCount
    batchCount
    containerCount
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
    # TODO: query for collapse batch, container and shipment
  }
`;

export const orderCardWithOptimiseFragment = gql`
  fragment orderCardWithOptimiseFragment on Order {
    id
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
        }
        tags {
          ...tagFragment
        }
        batches {
          ... on Batch {
            id
            archived
            no
            shipment {
              ... on Shipment {
                id
                blNo
              }
            }
            container {
              ... on Container {
                id
                no
                tags {
                  ...tagFragment
                }
                todo {
                  taskCount {
                    ...taskCountFragment
                  }
                }
              }
            }
            todo {
              taskCount {
                ...taskCountFragment
              }
            }
          }
        }
      }
    }
    shipments {
      ... on Shipment {
        id
        archived
        blNo
        tags {
          ...tagFragment
        }
      }
    }
  }
`;

export const shipmentCardNewRMFragment = gql`
  fragment shipmentCardNewRMFragment on Shipment {
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
              ...productProviderNewRMFragment
            }
          }
        }
      }
    }
  }
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
        ...orderCardOptimiseFragment
      }
      page
      totalPage
    }
  }

  ${orderCardOptimiseFragment}
  ${tagFragment}
  ${taskCountFragment}
`;

export const orderFocusDetailQuery = gql`
  query orderFocusDetailQuery($id: ID!) {
    order(id: $id) {
      ...orderCardWithOptimiseFragment
    }
  }

  ${orderCardWithOptimiseFragment}
  ${tagFragment}
  ${taskCountFragment}
`;
