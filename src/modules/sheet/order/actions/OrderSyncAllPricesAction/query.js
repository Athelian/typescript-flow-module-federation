// @flow
import gql from 'graphql-tag';
import { priceFragment, forbiddenFragment } from 'graphql';

export const syncAllPricesProductProvidersQuery = gql`
  query syncAllPricesProductProvidersQuery($ids: [ID!]!) {
    productProvidersByIDs(ids: $ids) {
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

export default syncAllPricesProductProvidersQuery;
