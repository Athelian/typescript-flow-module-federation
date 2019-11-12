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
  sheetModelFragment,
  sheetOwnedFragment,
  sheetWarehouseFragment,
} from 'modules/sheet/common/fragment';
import { sheetOrderFragment } from 'modules/sheet/order/fragment';
import { sheetOrderItemFragment } from 'modules/sheet/orderItem/fragment';
import {
  sheetBatchFragment,
  sheetBatchQuantityRevisionFragment,
} from 'modules/sheet/batch/fragment';
import { sheetShipmentFragment, sheetTimelineDateFragment } from 'modules/sheet/shipment/fragment';
import { sheetContainerFragment } from 'modules/sheet/container/fragment';

const sheetShipmentExtraFragment = gql`
  fragment sheetShipmentExtraFragment on Shipment {
    containerCount
  }
`;

export const batchesQuery = gql`
  query batchesQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...sheetBatchFragment
        ...sheetModelFragment
        ...sheetOwnedFragment
        ... on Batch {
          orderItem {
            ...sheetOrderItemFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ... on OrderItem {
              order {
                ...sheetOrderFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
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
  ${sheetBatchQuantityRevisionFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetContainerFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetWarehouseFragment}

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
      ... on OrderItem {
        order {
          ...sheetOrderFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
        }
        batches {
          ... on Batch {
            id
          }
        }
      }
    }
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}

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
  ${sheetWarehouseFragment}

  ${userAvatarFragment}
  ${documentFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!) {
    shipment(id: $id) {
      ...sheetShipmentFragment
      ...sheetShipmentExtraFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
    }
  }

  ${sheetShipmentFragment}
  ${sheetShipmentExtraFragment}
  ${sheetTimelineDateFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetWarehouseFragment}

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

export const orderByIDQuery = gql`
  query orderByIDQuery($id: ID!) {
    order(id: $id) {
      ...sheetOrderFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ... on Order {
        orderItems {
          ... on OrderItem {
            id
          }
        }
      }
    }
  }

  ${sheetOrderFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}

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
