// @flow
import gql from 'graphql-tag';

export const sheetOrderFragment = gql`
  fragment sheetOrderFragment on Order {
    followers {
      ...userAvatarFragment
    }
    archived
    poNo
    memo
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    issuedAt
    piNo
    currency
    incoterm
    deliveryPlace
    deliveryDate
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
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
  }
`;

export default sheetOrderFragment;
