// @flow
import gql from 'graphql-tag';

export const sheetOrderItemFragment = gql`
  fragment sheetOrderItemFragment on OrderItem {
    followers {
      ...userAvatarFragment
    }
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
      ...forbiddenFragment
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
