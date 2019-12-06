// @flow
import gql from 'graphql-tag';
import {
  ownedByFragment,
  userAvatarFragment,
  orderCardFragment,
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
} from 'graphql';

const orderItemFormWithOrderFragment = gql`
  fragment orderItemFormWithOrderFragment on OrderItem {
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
    }
    memo
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    order {
      ... on Order {
        ...orderCardFragment
        exporter {
          ...partnerNameFragment
        }
        importer {
          ...partnerNameFragment
        }
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
      ...orderItemFormWithOrderFragment
      ...forbiddenFragment
    }
  }
  ${orderItemFormWithOrderFragment}
  ${orderCardFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
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
  ${productProviderPackagingFragment}
  ${forbiddenFragment}
`;

export default orderItemFormQuery;
