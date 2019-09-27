import gql from 'graphql-tag';
import { tagFragment, taskCountFragment, ownedByFragment } from 'graphql';

const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    id
    date
    latestDate
    approvedAt
  }
`;

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
    ownedBy {
      ...ownedByFragment
    }
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

export const orderCardFullFragment = gql`
  fragment orderCardFullFragment on Order {
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
        updatedAt
        createdAt
        ownedBy {
          ...ownedByFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            name
            supplier {
              ... on Organization {
                id
                name
              }
            }
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
            updatedAt
            createdAt
            deliveredAt
            expiredAt
            desiredAt
            ownedBy {
              ...ownedByFragment
            }
            archived
            no
            latestQuantity
            totalVolume {
              value
              metric
            }
            shipment {
              ... on Shipment {
                id
                no
                tags {
                  ...tagFragment
                }
                transportType
                cargoReady {
                  ...timelineDateFragment
                }
                voyages {
                  ... on Voyage {
                    id
                    departurePort {
                      seaportName
                      airportName
                    }
                    arrivalPort {
                      seaportName
                      airportName
                    }
                    departure {
                      ...timelineDateFragment
                    }
                    arrival {
                      ...timelineDateFragment
                    }
                  }
                }
                containerGroups {
                  ... on ContainerGroup {
                    id
                    warehouse {
                      ... on Warehouse {
                        id
                        name
                      }
                    }
                    customClearance {
                      ...timelineDateFragment
                    }
                    warehouseArrival {
                      ...timelineDateFragment
                    }
                    deliveryReady {
                      ...timelineDateFragment
                    }
                  }
                }
                containers {
                  ... on Container {
                    id
                    warehouseArrivalActualDateApprovedAt
                  }
                }
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
        archived
        tags {
          ...tagFragment
        }
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
        warehouseArrivalAgreedDate
        warehouseArrivalActualDate
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
        no
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

// TODO: consider to optimise the hits if no search or filter
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
      hits {
        ... on Hit {
          entityHits {
            ... on EntityHit {
              field
              entity {
                ... on Model {
                  id
                }
              }
            }
          }
        }
      }
      page
      totalPage
    }
  }

  ${orderCardOptimiseFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${ownedByFragment}
`;

export const orderFocusDetailQuery = gql`
  query orderFocusDetailQuery($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ...orderCardFullFragment
    }
  }

  ${orderCardFullFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
`;

export const orderFullFocusDetailQuery = gql`
  query orderFullFocusDetailQuery($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ...orderCardOptimiseFragment
      ...orderCardFullFragment
    }
  }

  ${orderCardOptimiseFragment}
  ${orderCardFullFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
`;
