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
      ...forbiddenFragment
    }
    files @include(if: $isSummary) {
      ...documentSummaryFragment
      ...forbiddenFragment
      __typename
    }
    files @skip(if: $isSummary) {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    todo {
      tasks @skip(if: $isSummary) {
        ...taskWithoutParentInfoFragment
        __typename
      }
      taskTemplate @skip(if: $isSummary) {
        ...taskTemplateCardFragment
        __typename
      }
      tasks @include(if: $isSummary) {
        ...taskInfoSummaryFragment
      }
      __typename
    }
    sort
  }
`;

export default sheetOrderItemFragment;
