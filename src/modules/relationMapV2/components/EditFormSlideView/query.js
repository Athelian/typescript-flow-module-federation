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
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
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
  documentFragment,
  orderFormFragment,
  itemInOrderFormFragment,
  containerCardFragment,
} from 'graphql';

export const ordersAndShipmentsQuery = gql`
  query ordersAndShipmentsQuery($orderIds: [ID!]!, $shipmentIds: [ID!]!) {
    ordersByIDs(ids: $orderIds) {
      ...orderFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
    shipmentsByIDs(ids: $shipmentIds) {
      ...shipmentFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${orderFormFragment}
  ${itemInOrderFormFragment}
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
  ${badRequestFragment}
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
  ${containerCardFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
  ${documentFragment}
`;

export default ordersAndShipmentsQuery;
