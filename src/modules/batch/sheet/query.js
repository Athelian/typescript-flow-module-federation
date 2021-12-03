/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  documentSummaryFragment,
  tagFragment,
  taskInfoSummaryFragment,
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
import { sheetProductProviderFragment } from 'modules/sheet/productProvider/fragment';
import { sheetOrderItemFragment } from 'modules/sheet/orderItem/fragment';
import { sheetBatchFragment } from 'modules/sheet/batch/fragment';
import { sheetShipmentFragment, sheetTimelineDateFragment } from 'modules/sheet/shipment/fragment';
import { sheetContainerFragment } from 'modules/sheet/container/fragment';

const sheetShipmentExtraFragment = gql`
  fragment sheetShipmentExtraFragment on Shipment {
    containerCount
    totalVolume {
      value
      metric
    }
  }
`;

export const batchesQuery = gql`
  query batchesQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
    $isSummary: Boolean = false
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
                ...sheetProductProviderFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
                ... on ProductProvider {
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
            ...sheetCustomizableFragment
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
  ${sheetProductProviderFragment}
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
  ${documentSummaryFragment}
  ${tagFragment}
  ${taskInfoSummaryFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
  ${ownedByFragment}
`;

export const orderItemByIDQuery = gql`
  query orderItemByIDQuery($id: ID!, $isSummary: Boolean = false) {
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
          ...sheetProductProviderFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
          ... on ProductProvider {
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
  ${sheetProductProviderFragment}
  ${sheetOrderItemFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetMaskFragment}

  ${userAvatarFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${documentSummaryFragment}
  ${taskInfoSummaryFragment}
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
      ...sheetCustomizableFragment
    }
  }

  ${sheetContainerFragment}
  ${sheetModelFragment}
  ${sheetOwnedFragment}
  ${sheetCustomizableFragment}
  ${sheetWarehouseFragment}
  ${ownedByFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!, $isSummary: Boolean = false) {
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
  ${documentSummaryFragment}
  ${taskInfoSummaryFragment}
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
  query orderByIDQuery($id: ID!, $isSummary: Boolean = false) {
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
  ${documentSummaryFragment}
  ${taskInfoSummaryFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
  ${ownedByFragment}
`;
