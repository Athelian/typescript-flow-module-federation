/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  documentSummaryFragment,
  tagFragment,
  partnerNameFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskInfoSummaryFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
  ownedByFragment,
} from 'graphql';
import {
  sheetCustomizableFragment,
  sheetModelFragment,
  sheetOwnedFragment,
  sheetWarehouseFragment,
  sheetMaskFragment,
} from 'modules/sheet/common/fragment';
import { sheetOrderFragment } from 'modules/sheet/order/fragment';
import { sheetOrderItemFragment } from 'modules/sheet/orderItem/fragment';
import { sheetBatchFragment } from 'modules/sheet/batch/fragment';
import { sheetShipmentFragment, sheetTimelineDateFragment } from 'modules/sheet/shipment/fragment';
import { sheetContainerFragment } from 'modules/sheet/container/fragment';
import { sheetProductFragment } from 'modules/sheet/product/fragment';
import { sheetProductProviderFragment } from 'modules/sheet/productProvider/fragment';

export const shipmentsQuery = gql`
  query shipmentsQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
    $isSummary: Boolean = false
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...sheetShipmentFragment
        ...sheetModelFragment
        ...sheetOwnedFragment
        ...sheetCustomizableFragment
        ... on Shipment {
          batchesWithoutContainer {
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
            }
          }
          containers {
            ...sheetContainerFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ...sheetCustomizableFragment
            ... on Container {
              batches {
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
  ${sheetProductFragment}
  ${sheetProductProviderFragment}
  ${sheetShipmentFragment}
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

export const containerByIDQuery = gql`
  query containerByIDQuery($id: ID!, $isSummary: Boolean = false) {
    container(id: $id) {
      ...sheetContainerFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
      ... on Container {
        batches {
          ...sheetBatchFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
          ...sheetCustomizableFragment
          ... on Batch {
            shipment {
              ... on Shipment {
                id
              }
            }
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
          }
        }
      }
    }
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetProductFragment}
  ${sheetProductProviderFragment}
  ${sheetBatchFragment}
  ${sheetContainerFragment}
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

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!, $isSummary: Boolean = false) {
    batch(id: $id) {
      ...sheetBatchFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
      ... on Batch {
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
      }
    }
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetProductFragment}
  ${sheetBatchFragment}
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
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetProductFragment}
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

export const orderByIDQuery = gql`
  query orderByIDQuery($id: ID!, $isSummary: Boolean = false) {
    order(id: $id) {
      ...sheetOrderFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ...sheetCustomizableFragment
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
