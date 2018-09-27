// @flow
import gql from 'graphql-tag';

export const partnerListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    viewer {
      user {
        id
        group {
          id
          partners(page: $page, perPage: $perPage) {
            nodes {
              id
              name
              types
              group {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export default partnerListQuery;
