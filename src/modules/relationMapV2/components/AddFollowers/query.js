import gql from 'graphql-tag';
import { forbiddenFragment, userAvatarFragment } from 'graphql';

export const ordersByIDsQuery = gql`
  query ordersByIDs($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Order {
        id
        followers {
          ...userAvatarFragment
        }
        exporter {
          ... on Organization {
            id
            name
          }
        }
        importer {
          ... on Organization {
            id
            name
          }
        }
      }
    }
  }
  ${forbiddenFragment}
  ${userAvatarFragment}
`;

export const shipmentsByIDsQuery = gql`
  query shipmentsByIDs($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Shipment {
        id
        followers {
          ...userAvatarFragment
        }
        exporter {
          ... on Organization {
            id
            name
          }
        }
        importer {
          ... on Organization {
            id
            name
          }
        }
        forwarders {
          ... on Organization {
            id
            name
          }
        }
      }
    }
  }
  ${forbiddenFragment}
  ${userAvatarFragment}
`;
