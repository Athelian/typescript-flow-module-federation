// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import type { ProductCreate, ProductUpdate } from '../type.js.flow';

export const createProductMutation: Object = gql`
  mutation productCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      product {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const prepareCreateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  tags = [],
  productProviders = [],
}: Object): ProductCreate => ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  tagIds: tags.map(({ id }) => id),
  productProviders: productProviders.map(
    ({ isNew, id, updatedAt, exporter, supplier, ...productProvider }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      exporterId: exporter.id,
      supplierId: supplier ? supplier.id : null,
    })
  ),
});

export const updateProductMutation: Object = gql`
  mutation productUpdate($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      product {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const prepareUpdateProductInput = ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  tags = [],
  productProviders = [],
}: Object): ProductUpdate => ({
  name,
  serial,
  janCode,
  hsCode,
  material,
  tagIds: tags.map(({ id }) => id),
  productProviders: productProviders.map(
    ({ isNew, id, updatedAt, exporter, supplier, ...productProvider }) => ({
      ...productProvider,
      ...(isNew ? {} : { id }),
      exporterId: exporter.id,
      supplierId: supplier ? supplier.id : null,
    })
  ),
});
