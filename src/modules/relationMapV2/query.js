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

const shipmentEntityCardFragment = gql`
  fragment shipmentEntityCardFragment on Shipment {
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
`;

const containerEntityCardFragment = gql`
  fragment containerEntityCardFragment on Container {
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
    latestQuantity
    totalVolume {
      value
      metric
    }
    tags {
      ...tagFragment
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
    }
  }
`;

const orderEntityCardFragment = gql`
  fragment orderEntityCardFragment on Order {
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
    tags {
      ...tagFragment
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
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
`;

export const orderFullFocusDetailQuery = gql`
  query orderFullFocusDetailQuery($ids: [ID!]!) {
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
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
`;

export const shipmentFocusedListQuery = gql`
  query shipmentFocusedListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
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
  ${taskCountFragment}
  ${ownedByFragment}
  ${timelineDateFragment}
`;
