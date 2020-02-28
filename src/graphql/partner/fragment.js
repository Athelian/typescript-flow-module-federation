// @flow
import gql from 'graphql-tag';

export const partnerFormFragment = gql`
  fragment partnerFormFragment on Partner {
    id
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
