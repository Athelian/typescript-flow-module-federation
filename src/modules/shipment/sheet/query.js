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

export const shipmentsQuery = gql`
  query shipmentsQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...sheetShipmentFragment
        ...sheetModelFragment
        ...sheetOwnedFragment
        ... on Shipment {
          batchesWithoutContainer {
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
            }
          }
          containers {
            ...sheetContainerFragment
            ...sheetModelFragment
            ...sheetOwnedFragment
            ... on Container {
              batches {
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
  ${sheetBatchQuantityRevisionFragment}
  ${sheetShipmentFragment}
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

export const containerByIDQuery = gql`
  query containerByIDQuery($id: ID!) {
    container(id: $id) {
      ...sheetContainerFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
      ... on Container {
        batches {
          ...sheetBatchFragment
          ...sheetModelFragment
          ...sheetOwnedFragment
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
              ... on OrderItem {
                order {
                  ...sheetOrderFragment
                  ...sheetModelFragment
                  ...sheetOwnedFragment
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
  ${sheetBatchFragment}
  ${sheetBatchQuantityRevisionFragment}
  ${sheetContainerFragment}
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

export const batchByIDQuery = gql`
  query batchByIDQuery($id: ID!) {
    batch(id: $id) {
      ...sheetBatchFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
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
          ... on OrderItem {
            order {
              ...sheetOrderFragment
              ...sheetModelFragment
              ...sheetOwnedFragment
            }
          }
        }
      }
    }
  }

  ${sheetOrderFragment}
  ${sheetOrderItemFragment}
  ${sheetBatchFragment}
  ${sheetBatchQuantityRevisionFragment}
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

export const orderByIDQuery = gql`
  query orderByIDQuery($id: ID!) {
    order(id: $id) {
      ...sheetOrderFragment
      ...sheetModelFragment
      ...sheetOwnedFragment
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
