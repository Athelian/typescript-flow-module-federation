// @flow
import gql from 'graphql-tag';
import {
  itemInOrderFormFragment,
  batchFormFragment,
  itemInBatchFormFragment,
  priceFragment,
  customFieldsFragment,
  tagFragment,
  todoFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
  imageFragment,
  documentFragment,
  userAvatarFragment,
  ownedByFragment,
  shipmentCardFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  orderCardFragment,
  partnerCardFragment,
  timelineDateMinimalFragment,
  portFragment,
} from 'graphql';

export const orderFormItemsQuery = gql`
  query orderFormItemsQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        orderItems {
          ...itemInOrderFormFragment
        }
      }
    }
  }

  ${itemInOrderFormFragment}
  ${batchFormFragment}
  ${itemInBatchFormFragment}
  ${priceFragment}
  ${customFieldsFragment}
  ${tagFragment}
  ${todoFragment}
  ${taskFormInSlideViewFragment}
  ${taskFormInTemplateFragment}
  ${taskTemplateCardFragment}
  ${partnerNameFragment}
  ${metricFragment}
  ${sizeFragment}
  ${imageFragment}
  ${documentFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${shipmentCardFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${orderCardFragment}
  ${partnerCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
`;

export default orderFormItemsQuery;
