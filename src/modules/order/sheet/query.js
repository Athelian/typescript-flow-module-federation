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

const sheetShipmentCountFragment = gql`
  fragment sheetShipmentCountFragment on Shipment {
    containerCount
  }
`;

export const ordersQuery = gql`
  query ordersQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
    $isSummary: Boolean = false
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
                ...sheetBatchFragment
                ...sheetModelFragment
                ...sheetOwnedFragment
                ...sheetCustomizableFragment
                ... on Batch {
                  container {
                    ...sheetContainerFragment
                    ...sheetModelFragment
                    ...sheetOwnedFragment
                    ...sheetCustomizableFragment
                  }
                  shipment {
                    ...sheetShipmentFragment
                    ...sheetShipmentCountFragment
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
  ${sheetProductFragment}
  ${sheetProductProviderFragment}
  ${sheetOrderItemFragment}
  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentCountFragment}
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
          ... on Order {
            id
          }
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
          ...sheetBatchFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
          ... on Batch {
            container {
              ...sheetContainerFragment
              ...sheetModelFragment
              ...sheetOwnedFragment
              ...sheetCustomizableFragment
            }
            shipment {
              ...sheetShipmentFragment
              ...sheetShipmentCountFragment
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
  ${sheetProductFragment}
  ${sheetProductProviderFragment}
  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentCountFragment}
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

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!, $isSummary: Boolean = false) {
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
          ...sheetCustomizableFragment
        }
        shipment {
          ...sheetShipmentFragment
          ...sheetShipmentCountFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
        }
      }
    }
  }

  ${sheetBatchFragment}
  ${sheetShipmentFragment}
  ${sheetShipmentCountFragment}
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

  ${userAvatarFragment}
  ${tagFragment}
`;

export const shipmentByIDQuery = gql`
  query shipmentByIDQuery($id: ID!, $isSummary: Boolean = false) {
    shipment(id: $id) {
      ...sheetShipmentFragment
      ...sheetShipmentCountFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
    }
  }

  ${sheetShipmentFragment}
  ${sheetShipmentCountFragment}
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
