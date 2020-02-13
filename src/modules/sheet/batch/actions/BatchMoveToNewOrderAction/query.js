// @flow
import gql from 'graphql-tag';
import {
  priceFragment,
  metricFragment,
  maskFragment,
  sizeFragment,
  fieldDefinitionFragment,
  fieldValuesFragment,
  customFieldsFragment,
  tagFragment,
  taskCountFragment,
  partnerNameFragment,
  productProviderPackagingFragment,
  imageFragment,
  documentFragment,
  forbiddenFragment,
  ownedByFragment,
} from 'graphql';

const orderItemFormFragment = gql`
  fragment orderItemFormFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    deliveryDate
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    memo
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
        defaultPackage {
          ...productProviderPackagingFragment
        }
        packages {
          ...productProviderPackagingFragment
        }
        unitPrice {
          ...priceFragment
        }
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
              ...forbiddenFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
    files {
      ...documentFragment
    }
  }
`;

export const orderItemFormQuery = gql`
  query orderItemFormQuery($id: ID!) {
    orderItem(id: $id) {
      ...orderItemFormFragment
      ...forbiddenFragment
    }
  }
  ${orderItemFormFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${fieldDefinitionFragment}
  ${fieldValuesFragment}
  ${maskFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${imageFragment}
  ${customFieldsFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${productProviderPackagingFragment}
  ${forbiddenFragment}
`;

export default orderItemFormQuery;
