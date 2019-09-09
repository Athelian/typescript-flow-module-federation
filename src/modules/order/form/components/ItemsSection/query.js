// @flow
import gql from 'graphql-tag';
import {
  itemInOrderFormFragment,
  batchFormFragment,
  itemInBatchFormFragment,
  priceFragment,
  customFieldsFragment,
  tagFragment,
  milestoneCardFragment,
  projectCardNewFragment,
  milestoneFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
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
  productProviderPackagingFragment,
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
  ${milestoneCardFragment}
  ${projectCardNewFragment}
  ${milestoneFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
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
  ${productProviderPackagingFragment}
`;

export default orderFormItemsQuery;
