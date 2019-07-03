// @flow
import gql from 'graphql-tag';

export const productProviderAutoDateQuery = gql`
  query productProviderAutoDateQuery($id: ID!) {
    productProvider(id: $id) {
      ... on ProductProvider {
        id
      }
    }
  }
`;

export default productProviderAutoDateQuery;
