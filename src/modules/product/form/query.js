// @flow
import gql from 'graphql-tag';
import {
  productFormFragment,
  userAvatarFragment,
  tagFragment,
  imageFragment,
  partnerCardFragment,
  priceFragment,
  metricFragment,
  sizeFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  productProviderFormFragment,
  documentFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';

export const productFormQuery = gql`
  query productFormQuery($id: ID!) {
    product(id: $id) {
      ...productFormFragment
      ...forbiddenFragment
    }
  }

  ${productFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export default productFormQuery;
