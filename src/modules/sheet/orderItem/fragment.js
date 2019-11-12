// @flow
import gql from 'graphql-tag';

export const sheetOrderItemFragment = gql`
  fragment sheetOrderItemFragment on OrderItem {
    no
    quantity
    price {
      value: amount
      metric: currency
    }
    deliveryDate
    memo
    tags {
      ...tagFragment
    }
    productProvider {
      ...forbiddenFragment
      ... on ProductProvider {
        id
        product {
          ...forbiddenFragment
          ... on Product {
            id
            name
            serial
            ...sheetOwnedFragment
          }
        }
        ...sheetOwnedFragment
      }
    }
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    sort
  }
`;
