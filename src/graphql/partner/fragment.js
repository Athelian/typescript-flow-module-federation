// @flow
import gql from 'graphql-tag';

export const partnerFormFragment = gql`
  fragment partnerFormFragment on Organization {
    id
  }
`;

export const partnerCardFragment = gql`
  fragment partnerCardFragment on Organization {
    id
    name
    types
    partner {
      ... on Partner {
        id
        code
        organization {
          ... on Organization {
            id
            name
          }
        }
      }
    }
  }
`;
