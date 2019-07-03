// @flow
import gql from 'graphql-tag';

export const productAutoDateQuery = gql`
  query productAutoDateQuery($id: ID!) {
    product(id: $id) {
      ... on Product {
        id
      }
    }
  }
`;

export default productAutoDateQuery;
