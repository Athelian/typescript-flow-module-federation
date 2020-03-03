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

export default sheetOrderFragment;
