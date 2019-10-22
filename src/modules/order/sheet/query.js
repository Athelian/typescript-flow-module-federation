// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
} from 'graphql';

const orderSheetFragment = gql`
  fragment orderSheetFragment on Order {
    id
    archived
    poNo
    memo
    issuedAt
    piNo
    currency
    incoterm
    deliveryPlace
    deliveryDate
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const orderItemSheetFragment = gql`
  fragment orderItemSheetFragment on OrderItem {
    id
    no
    quantity
    price {
      value: amount
      metric: currency
    }
    deliveryDate
    sort
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    productProvider {
      ...forbiddenFragment
      ... on ProductProvider {
        id
        product {
          ...forbiddenFragment
          ... on Product {
            id
            name
            serial
            ownedBy {
              ... on Organization {
                id
              }
            }
          }
        }
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const batchSheetFragment = gql`
  fragment batchSheetFragment on Batch {
    id
    no
    quantity
    batchQuantityRevisions {
      ... on BatchQuantityRevision {
        id
        quantity
        type
      }
    }
    deliveredAt
    desiredAt
    expiredAt
    producedAt
    packageName
    packageCapacity
    packageQuantity
    sort
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const shipmentSheetFragment = gql`
  fragment shipmentSheetFragment on Shipment {
    id
    archived
    no
    createdAt
    updatedAt
    blNo
    blDate
    bookingNo
    bookingDate
    invoiceNo
    contractNo
    carrier
    cargoReady {
      ...timelineDateFragment
    }
    voyages {
      ... on Voyage {
        id
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
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    id
    date
    assignedTo {
      ...userAvatarFragment
    }
    approvedBy {
      ...userAvatarFragment
    }
    approvedAt
    timelineDateRevisions {
      ... on TimelineDateRevision {
        id
        date
        type
      }
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const containerSheetFragment = gql`
  fragment containerSheetFragment on Container {
    id
    no
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    yardName
    departureDate
    totalPackageQuantity
    totalQuantity
    orderItemCount
    containerType
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const ordersQuery = gql`
  query ordersQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderSheetFragment
        ... on Order {
          orderItems {
            ...orderItemSheetFragment
            ... on OrderItem {
              batches {
                ...batchSheetFragment
                ... on Batch {
                  container {
                    ...containerSheetFragment
                  }
                  shipment {
                    ...shipmentSheetFragment
                  }
                }
              }
            }
          }
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${orderSheetFragment}
  ${orderItemSheetFragment}
  ${batchSheetFragment}
  ${shipmentSheetFragment}
  ${containerSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export const orderItemByIDQuery = gql`
  query orderItemByIDQuery($id: ID!) {
    orderItem(id: $id) {
      ...orderItemSheetFragment
      ... on OrderItem {
        sort
        order {
          ... on Order {
            id
          }
        }
        batches {
          ...batchSheetFragment
          ... on Batch {
            container {
              ...containerSheetFragment
            }
            shipment {
              ...shipmentSheetFragment
            }
          }
        }
      }
    }
  }

  ${orderItemSheetFragment}
  ${batchSheetFragment}
  ${shipmentSheetFragment}
  ${containerSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!) {
    batch(id: $id) {
      ...batchSheetFragment
      ... on Batch {
        sort
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
        container {
          ...containerSheetFragment
        }
        shipment {
          ...shipmentSheetFragment
        }
      }
    }
  }

  ${batchSheetFragment}
  ${shipmentSheetFragment}
  ${containerSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export const batchQuantityRevisionByIDQuery = gql`
  query batchQuantityRevisionByIDQuery($id: ID!) {
    batchQuantityRevision(id: $id) {
      ... on BatchQuantityRevision {
        id
        quantity
        type
        sort
        batch {
          ... on Batch {
            id
          }
        }
      }
    }
  }
`;

export const containerByIDQuery = gql`
  query containerByIDQuery($id: ID!) {
    container(id: $id) {
      ...containerSheetFragment
    }
  }

  ${containerSheetFragment}
  ${userAvatarFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!) {
    shipment(id: $id) {
      ...shipmentSheetFragment
    }
  }

  ${shipmentSheetFragment}
  ${timelineDateFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export const orderMutation = gql`
  mutation orderMutation($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const orderItemMutation = gql`
  mutation orderItemMutation($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const batchMutation = gql`
  mutation batchMutation($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const shipmentMutation = gql`
  mutation shipmentMutation($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const containerMutation = gql`
  mutation containerMutation($id: ID!, $input: ContainerUpdateInput!) {
    containerUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;
