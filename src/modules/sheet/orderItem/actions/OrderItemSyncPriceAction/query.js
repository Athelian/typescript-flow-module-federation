// @flow
import gql from 'graphql-tag';
import { priceFragment, forbiddenFragment } from 'graphql';

export const syncPriceProductProviderQuery = gql`
  query syncPriceProductProviderQuery($id: ID!) {
    productProvider(id: $id) {
      ... on ProductProvider {
        id
        unitPrice {
          ...priceFragment
        }
      }
      ...forbiddenFragment
    }
  }

  ${priceFragment}
  ${forbiddenFragment}
`;

export default syncPriceProductProviderQuery;
