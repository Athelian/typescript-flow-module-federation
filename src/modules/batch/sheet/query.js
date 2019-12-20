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
  ownedByFragment,
} from 'graphql';
import {
  sheetCustomizableFragment,
  sheetMaskFragment,
  sheetModelFragment,
  sheetOwnedFragment,
  sheetWarehouseFragment,
} from 'modules/sheet/common/fragment';
import { sheetOrderFragment } from 'modules/sheet/order/fragment';
import { sheetProductFragment } from 'modules/sheet/product/fragment';
import { sheetOrderItemFragment } from 'modules/sheet/orderItem/fragment';
import { sheetBatchFragment } from 'modules/sheet/batch/fragment';
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
        ...sheetCustomizableFragment
        ... on Batch {
          orderItem {
            ...sheetOrderItemFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ...sheetCustomizableFragment
            ... on OrderItem {
              order {
                ...sheetOrderFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
              }
              productProvider {
                ... on ProductProvider {
                  id
                  product {
                    ...sheetProductFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
                  }
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
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${sheetOrderFragment}
  ${sheetProductFragment}
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
  ${ownedByFragment}
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
          ...sheetOrderFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            product {
              ...sheetProductFragment
              ...sheetModelFragment
              ...sheetOwnedFragment
              ...sheetCustomizableFragment
            }
          }
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
  ${sheetProductFragment}
  ${sheetOrderItemFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
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
  ${ownedByFragment}
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
  ${ownedByFragment}
`;

export const orderByIDQuery = gql`
  query orderByIDQuery($id: ID!) {
    order(id: $id) {
      ...sheetOrderFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
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
  ${sheetCustomizableFragment}
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
  ${ownedByFragment}
`;
