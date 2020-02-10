// @flow
import gql from 'graphql-tag';

export const sheetOrderFragment = gql`
  fragment sheetOrderFragment on Order {
    archived
    poNo
    memo
    tags {
      ...tagFragment
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
  }
`;
