// @flow
import gql from 'graphql-tag';
import { containerCardFragment, imageFragment, tagFragment, metricFragment } from 'graphql';

export const orderFormContainersQuery = gql`
  query orderFormContainersQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        containers {
          ...containerCardFragment
        }
      }
    }
  }

  ${containerCardFragment}
  ${imageFragment}
  ${tagFragment}
  ${metricFragment}
`;

export default orderFormContainersQuery;
