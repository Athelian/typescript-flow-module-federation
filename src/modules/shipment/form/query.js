// @flow
import gql from 'graphql-tag';
import {
  shipmentFormFragment,
  containerFormFragment,
  warehouseCardFragment,
  timelineDateFullFragment,
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
  documentFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  todoFragment,
  taskFormInSlideViewFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
} from 'graphql';

export const shipmentFormQuery = gql`
  query shipmentFormQuery($id: ID!) {
    shipment(id: $id) {
      ...shipmentFormFragment
      ...forbiddenFragment
    }
  }

  ${shipmentFormFragment}
  ${containerFormFragment}
  ${warehouseCardFragment}
  ${timelineDateFullFragment}
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
  ${documentFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${todoFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
`;

export default shipmentFormQuery;
