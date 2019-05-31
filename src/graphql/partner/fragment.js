// @flow
import gql from 'graphql-tag';

export const partnerFormFragment = gql`
  fragment partnerFormFragment on Group {
    id
  }
`;

export const partnerCardFragment = gql`
  fragment partnerCardFragment on Group {
    id
    name
    types
    partner {
      ... on Partner {
        id
        code
        group {
          ... on Group {
            id
            name
          }
        }
      }
    }
  }
`;
