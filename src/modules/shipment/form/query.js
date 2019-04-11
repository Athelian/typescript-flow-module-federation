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
  taskFormInSlideViewFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';

export const shipmentFormQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      ...shipmentFormFragment
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
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
`;

export default shipmentFormQuery;
