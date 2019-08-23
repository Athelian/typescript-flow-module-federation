import gql from 'graphql-tag';
import { tagFragment, taskCountFragment, ownedByFragment } from 'graphql';

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
    currency
    poNo
    orderItemCount
    orderItemChildlessCount
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
  }
`;

export const orderCardWithOptimiseFragment = gql`
  fragment orderCardWithOptimiseFragment on Order {
    id
    currency
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
    ownedBy {
      ...ownedByFragment
    }
    orderItems {
      ... on OrderItem {
        id
        ownedBy {
          ...ownedByFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            name
          }
        }
        archived
        no
        price {
          amount
          currency
        }
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
            ownedBy {
              ...ownedByFragment
            }
            archived
            no
            latestQuantity
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
            }
          }
        }
      }
    }
    containers {
      ... on Container {
        id
        no
        ownedBy {
          ...ownedByFragment
        }
        shipment {
          ... on Shipment {
            id
          }
        }
      }
    }
    shipments {
      ... on Shipment {
        id
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
        archived
        blNo
        ownedBy {
          ...ownedByFragment
        }
        tags {
          ...tagFragment
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
  ${ownedByFragment}
`;
