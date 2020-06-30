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
    files {
      ...documentFragment
      ...forbiddenFragment
    }
  }
`;

export default sheetProductProviderFragment;
