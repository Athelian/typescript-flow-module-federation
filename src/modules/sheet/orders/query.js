// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const orderSheetFragment = gql`
  fragment orderSheetFragment on Order {
    id
    poNo
    currency
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
    no
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
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const orderSheetQuery = gql`
  query orderSheetQuery(
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
