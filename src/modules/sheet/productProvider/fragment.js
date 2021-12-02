// @flow
import gql from 'graphql-tag';

export const sheetProductProviderFragment = gql`
  fragment sheetProductProviderFragment on ProductProvider {
    id
    supplier {
      ...partnerNameFragment
    }
    name
    unitPrice {
      value: amount
      metric: currency
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
  }
`;

export default sheetProductProviderFragment;
