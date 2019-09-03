// @flow
import gql from 'graphql-tag';

export const permissionsForOrganization = gql`
  query permissionsForOrganization($organizationId: ID!) {
    viewer {
      permissionsForOrganization(organizationId: $organizationId)
    }
  }
`;

export default permissionsForOrganization;
