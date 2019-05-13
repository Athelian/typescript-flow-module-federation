// @flow
import gql from 'graphql-tag';
import {
  orderFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  orderCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  todoFragment,
  taskFormInSlideViewFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  containerCardFragment,
  itemInOrderFormFragment,
  itemInBatchFormFragment,
} from 'graphql';

export const orderFormQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderFormFragment
    }
  }

  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${todoFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${containerCardFragment}
  ${itemInOrderFormFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
`;

export default orderFormQuery;
