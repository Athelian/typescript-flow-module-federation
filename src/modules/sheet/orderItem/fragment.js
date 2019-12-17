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

export default sheetOrderItemFragment;
