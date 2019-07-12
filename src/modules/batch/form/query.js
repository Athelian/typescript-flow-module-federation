// @flow
import gql from 'graphql-tag';
import {
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
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
  productProviderPackagingFragment,
} from 'graphql';

export const batchFormQuery = gql`
  query batchFormQuery($id: ID!) {
    batch(id: $id) {
      ...batchFormFragment
    }
  }

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
  ${productProviderPackagingFragment}
`;

export default batchFormQuery;
