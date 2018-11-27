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
  }
`;
