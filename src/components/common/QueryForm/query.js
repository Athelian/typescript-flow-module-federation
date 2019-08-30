// @flow
import gql from 'graphql-tag';

export const partnerPermissionQuery = gql`
  query partnerPermissionQuery($organizationId: ID!) {
    viewer {
      permissionsForOrganization(organizationId: $organizationId)
    }
  }
`;

/**
 * @deprecated
 */
export default partnerPermissionQuery;
