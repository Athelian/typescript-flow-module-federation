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
} from 'graphql';

export const ordersInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
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
  ${userAvatarFragment}
  ${taskCountFragment}
  ${ownedByFragment}
`;

export const itemsInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
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
`;

export const batchesInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: BatchFilterInput, $sortBy: BatchSortInput) {
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
`;

export const containersInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
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
  ${metricFragment}
`;

export const shipmentsInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ShipmentFilterInput, $sortBy: ShipmentSortInput) {
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
  ${portFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
`;
