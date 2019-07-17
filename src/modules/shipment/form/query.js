// @flow
import gql from 'graphql-tag';
import {
  shipmentFormQueryFragment,
  containerFormFragment,
  warehouseCardFragment,
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
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';

export const shipmentFormQuery = gql`
  query shipmentFormQuery($id: ID!) {
    shipment(id: $id) {
      ...shipmentFormQueryFragment
      ...forbiddenFragment
    }
  }

  ${shipmentFormQueryFragment}
  ${containerFormFragment}
  ${warehouseCardFragment}
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export default shipmentFormQuery;
