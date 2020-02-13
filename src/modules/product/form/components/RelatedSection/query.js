import gql from 'graphql-tag';
import {
  orderCardFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
  taskCountFragment,
  itemCardFragment,
  imageFragment,
  batchCardFragment,
  metricFragment,
  containerCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  ownedByFragment,
  forbiddenFragment,
} from 'graphql';

export const ordersInProductQuery = gql`
  query ordersInProductQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${orderCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export const itemsInProductQuery = gql`
  query itemsInProductQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderItemFilterInput
    $sortBy: OrderItemSortInput
  ) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...itemCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${itemCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${taskCountFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export const batchesInProductQuery = gql`
  query batchesInProductQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...batchCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${batchCardFragment}
  ${partnerNameFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export const containersInProductQuery = gql`
  query containersInProductQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ContainerFilterInput
    $sortBy: ContainerSortInput
  ) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...containerCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${containerCardFragment}
  ${imageFragment}
  ${tagFragment}
  ${forbiddenFragment}
  ${metricFragment}
`;

export const shipmentsInProductQuery = gql`
  query shipmentsInProductQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...shipmentCardFragment
      }
      totalCount
      page
      totalPage
    }
  }

  ${shipmentCardFragment}
  ${userAvatarFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${forbiddenFragment}
  ${portFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${ownedByFragment}
`;
