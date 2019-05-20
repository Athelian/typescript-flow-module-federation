// @flow
import gql from 'graphql-tag';
import { containerCardFragment, imageFragment, tagFragment, metricFragment } from 'graphql';

export const containerRelateOfOrder = gql`
  query containerRelateOfOrder($id: ID!) {
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

export default containerRelateOfOrder;
