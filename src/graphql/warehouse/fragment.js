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
        ...partnerCardFragment
      }
    }
    inCharges {
      ...userAvatarFragment
    }
    organizations {
      ...partnerCardFragment
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
