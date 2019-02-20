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
  badRequestFragment,
} from 'graphql';
import { prepareCustomFieldsData } from 'utils/customFields';
import type { ProductCreate, ProductUpdate } from '../type.js.flow';

export const createProductMutation: Object = gql`
  mutation productCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      __typename
      ...productFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${productFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}
  ${documentFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const prepareCreateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  customFields,
  tags = [],
  files = [],
  productProviders = [],
}: Object): ProductCreate => ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  customFields: prepareCustomFieldsData(customFields),
  files: files.map(({ id, name: fileName, type, memo }) => ({ id, name: fileName, type, memo })),
  tagIds: tags.map(({ id }) => id),
  productProviders: productProviders.map(
    ({
      isNew,
      id,
      referenced,
      updatedAt,
      exporter,
      supplier,
      origin,
      customFields: productProviderCustomFields,
      files: productProviderFiles,
      ...productProvider
    }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      origin: origin && origin.length > 0 ? origin : null,
      exporterId: exporter ? exporter.id : null,
      supplierId: supplier ? supplier.id : null,
      customFields: prepareCustomFieldsData(productProviderCustomFields),
      files: productProviderFiles.map(({ id: fileId, name: fileName, type, memo }) => ({
        id: fileId,
        name: fileName,
        type,
        memo,
      })),
    })
  ),
});

export const updateProductMutation: Object = gql`
  mutation productUpdate($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      __typename
      ...productFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${productFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}
  ${documentFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const prepareUpdateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  customFields,
  tags = [],
  files = [],
  productProviders = [],
}: Object): ProductUpdate => ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  customFields: prepareCustomFieldsData(customFields),
  files: files.map(({ id, name: fileName, type, memo }) => ({ id, name: fileName, type, memo })),
  tagIds: tags.map(({ id }) => id),
  productProviders: productProviders.map(
    ({
      isNew,
      id,
      origin,
      updatedAt,
      updatedBy,
      referenced,
      sort,
      exporter,
      supplier,
      customFields: productProviderCustomFields,
      files: productProviderFiles,
      ...productProvider
    }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      origin: origin && origin.length > 0 ? origin : null,
      exporterId: exporter ? exporter.id : null,
      supplierId: supplier ? supplier.id : null,
      customFields: prepareCustomFieldsData(productProviderCustomFields),
      files: productProviderFiles.map(({ id: fileId, name: fileName, type, memo }) => ({
        id: fileId,
        name: fileName,
        type,
        memo,
      })),
    })
  ),
});
