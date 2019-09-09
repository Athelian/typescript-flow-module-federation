// @flow
import gql from 'graphql-tag';
import {
  containerFormFragment,
  userAvatarFragment,
  warehouseCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  metricFragment,
  tagFragment,
  batchFormFragment,
  sizeFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  taskWithoutParentInfoFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  productProviderPackagingFragment,
} from 'graphql';

export const containerFormQuery = gql`
  query containerFormQuery($id: ID!) {
    container(id: $id) {
      ...containerFormFragment
    }
  }

  ${containerFormFragment}
  ${userAvatarFragment}
  ${warehouseCardFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${metricFragment}
  ${tagFragment}
  ${batchFormFragment}
  ${sizeFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${productProviderPackagingFragment}
`;

export default containerFormQuery;
