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
  taskWithoutParentInfoFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
} from 'graphql';

export const containerFormQuery = gql`
  query($id: ID!) {
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
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
`;

export default containerFormQuery;
