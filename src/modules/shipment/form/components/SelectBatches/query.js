// @flow
import gql from 'graphql-tag';
import {
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  taskFormInSlideViewFragment,
  todoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
} from 'graphql';

export const selectBatchListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: BatchFilterInput, $sortBy: BatchSortInput) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...batchFormFragment
      }
      page
      totalPage
    }
  }

  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${taskFormInSlideViewFragment}
  ${todoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
`;

export default selectBatchListQuery;
