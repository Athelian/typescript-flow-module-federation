// @flow
import gql from 'graphql-tag';
import {
  orderFormQueryFragment,
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
  itemInOrderFormFragment,
  itemInBatchFormFragment,
} from 'graphql';

export const orderFormQuery = gql`
  query order($id: ID!) {
    order(id: $id) {
      ...orderFormQueryFragment
    }
  }

  ${orderFormQueryFragment}
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
  ${itemInOrderFormFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
`;

export default orderFormQuery;
