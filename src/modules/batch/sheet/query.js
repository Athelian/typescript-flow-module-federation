// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  tagFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
  partnerNameFragment,
  documentFragment,
} from 'graphql';
import {
  batchSheetFragment,
  containerSheetFragment,
  shipmentSheetFragment,
  orderItemSheetFragment,
  orderSheetFragment,
  warehouseFragment,
  timelineDateFragment,
} from 'modules/gtv/fragment';

export const batchesQuery = gql`
  query batchesQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Batch {
          ...batchSheetFragment
          orderItem {
            ... on OrderItem {
              ...orderItemSheetFragment
              order {
                ...orderSheetFragment
              }
            }
          }
          container {
            ...containerSheetFragment
          }
          shipment {
            ...shipmentSheetFragment
          }
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${batchSheetFragment}
  ${orderItemSheetFragment}
  ${orderSheetFragment}
  ${containerSheetFragment}
  ${shipmentSheetFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${partnerNameFragment}
  ${documentFragment}
  ${warehouseFragment}
  ${timelineDateFragment}
  ${forbiddenFragment}
`;

export default batchesQuery;
