// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  tagFragment,
  partnerNameFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';
import {
  sheetCustomizableFragment,
  sheetMaskFragment,
  sheetModelFragment,
  sheetOwnedFragment,
  sheetWarehouseFragment,
} from 'modules/sheet/common/fragment';
import { sheetOrderFragment } from 'modules/sheet/order/fragment';
import { sheetOrderItemFragment } from 'modules/sheet/orderItem/fragment';
import { sheetBatchFragment } from 'modules/sheet/batch/fragment';
import { sheetShipmentFragment, sheetTimelineDateFragment } from 'modules/sheet/shipment/fragment';
import { sheetContainerFragment } from 'modules/sheet/container/fragment';

const sheetShipmentExtraFragment = gql`
  fragment sheetShipmentExtraFragment on Shipment {
    containerCount
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
        ...sheetOrderFragment
        ...sheetModelFragment
        ...sheetOwnedFragment
        ...sheetCustomizableFragment
        ... on Order {
          orderItems {
            ...sheetOrderItemFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ...sheetCustomizableFragment
            ... on OrderItem {
              batches {
                ...sheetBatchFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
                ... on Batch {
                  container {
                    ...sheetContainerFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                  }
                  shipment {
                    ...sheetShipmentFragment
                    ...sheetShipmentExtraFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
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

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetContainerFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const orderItemByIDQuery = gql`
  query orderItemByIDQuery($id: ID!) {
    orderItem(id: $id) {
      ...sheetOrderItemFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
      ... on OrderItem {
        order {
          ... on Order {
            id
          }
        }
        batches {
          ...sheetBatchFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
          ... on Batch {
            container {
              ...sheetContainerFragment
              ...sheetModelFragment
              ...sheetOwnedFragment
            }
            shipment {
              ...sheetShipmentFragment
              ...sheetShipmentExtraFragment
              ...sheetModelFragment
              ...sheetOwnedFragment
              ...sheetCustomizableFragment
            }
          }
        }
      }
    }
  }

  ${sheetOrderItemFragment}
  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetContainerFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!) {
    batch(id: $id) {
      ...sheetBatchFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
      ... on Batch {
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
          ...sheetContainerFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
        }
        shipment {
          ...sheetShipmentFragment
          ...sheetShipmentExtraFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
        }
      }
    }
  }

  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetContainerFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const containerByIDQuery = gql`
  query containerByIDQuery($id: ID!) {
    container(id: $id) {
      ...sheetContainerFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
    }
  }

  ${sheetContainerFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}

  ${userAvatarFragment}
  ${tagFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!) {
    shipment(id: $id) {
      ...sheetShipmentFragment
      ...sheetShipmentExtraFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
    }
  }

  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;
