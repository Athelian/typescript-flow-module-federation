// @flow
import gql from 'graphql-tag';

export const warehouseFormFragment = gql`
  fragment warehouseFormFragment on Warehouse {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    inCharges {
      ...userAvatarFragment
    }
    organizations {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    name
    street
    locality
    region
    postalCode
    country
    surface {
      ...metricFragment
    }
    customFields {
      ...customFieldsFragment
    }
  }
`;

export const warehouseCardFragment = gql`
  fragment warehouseCardFragment on Warehouse {
    id
    name
    ownedBy {
      ... on Organization {
        id
        name
      }
    }
  }
`;
