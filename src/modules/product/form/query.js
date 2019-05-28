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
  taskTemplateCardFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
} from 'graphql';

export const productFormQuery = gql`
  query productFormQuery($id: ID!) {
    product(id: $id) {
      ...productFormFragment
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
  ${taskTemplateCardFragment}
  ${taskFormInSlideViewFragment}
  ${taskFormInTemplateFragment}
`;

export default productFormQuery;
