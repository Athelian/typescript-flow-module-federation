// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { removeNulls, removeTypename } from 'utils/data';
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
}: Object): ProductCreate =>
  // $FlowFixMe ignore
  removeTypename(
    removeNulls({
      name,
      serial,
      janCode,
      hsCode,
      material,
      tagIds: tags.map(({ id }) => id),
    })
  );

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
}: Object): ProductUpdate =>
  removeNulls({
    name,
    serial,
    janCode,
    hsCode,
    material,
    tagIds: tags.map(({ id }) => id),
  });
