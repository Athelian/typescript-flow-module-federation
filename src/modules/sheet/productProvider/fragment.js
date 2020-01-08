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
  }
`;

export default sheetProductProviderFragment;
