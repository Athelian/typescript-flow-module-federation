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
} from 'graphql';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareCustomFieldsData } from 'utils/customFields';
import type { ProductCreate, ProductUpdate } from '../type.js.flow';

export const createProductMutation: Object = gql`
  mutation productCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      product {
        ...productFormFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${productFormFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}

  ${violationFragment}
`;

export const prepareCreateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  metadata,
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
  metadata,
  customFields: prepareCustomFieldsData(customFields),
  files: files.map(({ id, name: fileName, type, memo }) => ({ id, name: fileName, type, memo })),
  tagIds: tags.map(({ id }) => id),
  productProviders: productProviders.map(
    ({ isNew, id, updatedAt, exporter, supplier, origin, ...productProvider }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      origin: origin && origin.length > 0 ? origin : null,
      exporterId: exporter ? exporter.id : null,
      supplierId: supplier ? supplier.id : null,
    })
  ),
});

export const updateProductMutation: Object = gql`
  mutation productUpdate($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      product {
        ...productFormFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${productFormFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}

  ${violationFragment}
`;

export const prepareUpdateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  metadata,
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
  metadata,
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
      sort,
      exporter,
      supplier,
      ...productProvider
    }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      origin: origin && origin.length > 0 ? origin : null,
      exporterId: exporter ? exporter.id : null,
      supplierId: supplier ? supplier.id : null,
    })
  ),
});
