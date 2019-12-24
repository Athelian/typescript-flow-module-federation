// @flow
import gql from 'graphql-tag';

export const partnerFormFragment = gql`
  fragment partnerFormFragment on Organization {
    id
  }
`;

export const partnerCardFragment = gql`
  fragment partnerCardFragment on Partner {
    id
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
