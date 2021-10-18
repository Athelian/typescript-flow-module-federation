/* eslint-disable graphql/template-strings */

import gql from 'graphql-tag';
import {
  tagFragment,
  taskCountFragment,
  ownedByFragment,
  metricFragment,
  forbiddenFragment,
} from 'graphql';

const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    id
    date
    latestDate
    approvedAt
  }
`;

const shipmentEntityCardFragment = gql`
  fragment shipmentEntityCardFragment on Shipment {
    id
    orderCount
    totalVolumeOverride {
      ...metricFragment
    }
    totalVolumeOverriding
    totalVolume {
      ...metricFragment
    }
    ... on Followed {
      notificationUnseenCount
    }
    filesUnreadCount
    timeline {
      unreadMessageCount
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
    archived
    no
    blNo
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
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
    earliestWarehouseAgreedArrival
    latestWarehouseAgreedArrival
    earliestWarehouseActualArrival
    latestWarehouseActualArrival
  }
`;

const containerEntityCardFragment = gql`
  fragment containerEntityCardFragment on Container {
    id
    no
    archived
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    containerType
    ownedBy {
      ...ownedByFragment
    }
    shipment {
      ... on Shipment {
        id
      }
    }
    totalVolume {
      ...metricFragment
    }
  }
`;

const batchEntityCardFragment = gql`
  fragment batchEntityCardFragment on Batch {
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
    quantity
    producedQuantity
    preShippedQuantity
    shippedQuantity
    postShippedQuantity
    deliveredQuantity
    latestQuantity
    totalVolume {
      value
      metric
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
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
`;

const itemEntityCardFragment = gql`
  fragment itemEntityCardFragment on OrderItem {
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
    deliveryDate
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
      ...forbiddenFragment
    }
  }
`;

const orderEntityCardFragment = gql`
  fragment orderEntityCardFragment on Order {
    id
    archived
    currency
    poNo
    batchCount @skip(if: $skipOrderCounts)
    containerCount @skip(if: $skipOrderCounts)
    shipmentCount @skip(if: $skipOrderCounts)
    ... on Followed {
      notificationUnseenCount
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
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
  }
`;

export const orderCardFullFragment = gql`
  fragment orderCardFullFragment on Order {
    ...orderEntityCardFragment
    orderItems {
      ... on OrderItem {
        ...itemEntityCardFragment
        batches {
          ...batchEntityCardFragment
        }
      }
    }
    containers {
      ...containerEntityCardFragment
    }
    shipments {
      ...shipmentEntityCardFragment
    }
  }
`;

const shipmentSummaryFragment = gql`
  fragment shipmentSummaryFragment on Shipment {
    ... on Shipment {
      id
      orderCount
      totalVolumeOverride {
        ...metricFragment
      }
      totalVolumeOverriding
      totalVolume {
        ...metricFragment
      }
      ... on Followed {
        notificationUnseenCount
      }
      filesUnreadCount
      timeline {
        unreadMessageCount
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
      archived
      no
      blNo
      ownedBy {
        ...ownedByFragment
      }
      tags {
        ...tagFragment
        ...forbiddenFragment
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
      transportType

      cargoReady {
        ...timelineDateFragment
      }

      earliestWarehouseAgreedArrival
      latestWarehouseAgreedArrival
      earliestWarehouseActualArrival
      latestWarehouseActualArrival
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
          warehouseArrivalActualDate
          warehouseArrivalAgreedDate
        }
      }

      batches {
        ... on Batch {
          id
          deliveredAt
          desiredAt
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
                ... on ProductProvider {
                  id
                  product {
                    ... on Product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const shipmentSummaryQuery = gql`
  query shipmentSummaryQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...shipmentSummaryFragment
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

  ${tagFragment}
  ${metricFragment}
  ${ownedByFragment}
  ${shipmentSummaryFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

export const shipmentCardFullFragment = gql`
  fragment shipmentCardFullFragment on Shipment {
    ...shipmentEntityCardFragment
    containers {
      ...containerEntityCardFragment
    }
    batches {
      ... on Batch {
        ...batchEntityCardFragment
        orderItem {
          ... on OrderItem {
            ...itemEntityCardFragment
            order {
              ...orderEntityCardFragment
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
    $skipOrderCounts: Boolean = false
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardFullFragment
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

  ${orderCardFullFragment}
  ${shipmentEntityCardFragment}
  ${containerEntityCardFragment}
  ${batchEntityCardFragment}
  ${itemEntityCardFragment}
  ${orderEntityCardFragment}
  ${tagFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

export const orderFullFocusDetailQuery = gql`
  query orderFullFocusDetailQuery($ids: [ID!]!, $skipOrderCounts: Boolean = false) {
    ordersByIDs(ids: $ids) {
      ...orderCardFullFragment
    }
  }

  ${orderCardFullFragment}
  ${shipmentEntityCardFragment}
  ${containerEntityCardFragment}
  ${batchEntityCardFragment}
  ${itemEntityCardFragment}
  ${orderEntityCardFragment}
  ${tagFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

export const shipmentFocusedListQuery = gql`
  query shipmentFocusedListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
    $skipOrderCounts: Boolean = true
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...shipmentCardFullFragment
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

  ${shipmentCardFullFragment}
  ${shipmentEntityCardFragment}
  ${containerEntityCardFragment}
  ${batchEntityCardFragment}
  ${itemEntityCardFragment}
  ${orderEntityCardFragment}
  ${tagFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

export const shipmentFullFocusDetailQuery = gql`
  query shipmentFullFocusDetailQuery($ids: [ID!]!, $skipOrderCounts: Boolean = true) {
    shipmentsByIDs(ids: $ids) {
      ...shipmentCardFullFragment
    }
  }

  ${shipmentCardFullFragment}
  ${shipmentEntityCardFragment}
  ${containerEntityCardFragment}
  ${batchEntityCardFragment}
  ${itemEntityCardFragment}
  ${orderEntityCardFragment}
  ${tagFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

// for action modals that need specific data
export const shipmentPartialQuery = gql`
  query shipmentPartialQuery($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ...shipmentSummaryFragment
      ... on Shipment {
        ownedBy {
          ...ownedByFragment
        }
        containers {
          ... on Container {
            id
            shipment {
              ... on Shipment {
                id # for addTags. but can remove if we just loop through the available shipments
              }
            }
            ownedBy {
              ...ownedByFragment
            }
          }
        }

        batches {
          ... on Batch {
            id
            ownedBy {
              ...ownedByFragment
            }

            orderItem {
              ... on OrderItem {
                id
                ownedBy {
                  ...ownedByFragment
                }
                order {
                  ... on Order {
                    id
                    ownedBy {
                      ...ownedByFragment
                    }
                  }
                }

                productProvider {
                  ... on ProductProvider {
                    id
                    ownedBy {
                      ...ownedByFragment
                    }
                    product {
                      ... on Product {
                        id
                        ownedBy {
                          ...ownedByFragment
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${tagFragment}
  ${metricFragment}
  ${ownedByFragment}
  ${shipmentSummaryFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;
// # ${timelineDateFragment}
// # ${forbiddenFragment}
// # ${shipmentCardFullFragment}
// # ${shipmentEntityCardFragment}
// # ${containerEntityCardFragment}
// # ${batchEntityCardFragment}
// # ${itemEntityCardFragment}
// # ${orderEntityCardFragment}
// # ${tagFragment}
// # ${metricFragment}
// # ${taskCountFragment}
