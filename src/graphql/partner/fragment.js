// @flow
import gql from 'graphql-tag';

export const partnerFormFragment = gql`
  fragment partnerFormFragment on Partner {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    code
    types
    tags {
      ...tagFragment
    }
    organization {
      ... on Organization {
        id
        name
        tel
        country
        region
        locality
        street
        postalCode
      }
    }
  }
`;

export const partnerCardFragment = gql`
  fragment partnerCardFragment on Partner {
    id
    name
    code
    types
    organization {
      ... on Organization {
        id
        name
      }
    }
  }
`;
