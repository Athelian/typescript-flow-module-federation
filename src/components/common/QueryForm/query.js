// @flow
import gql from 'graphql-tag';

export const partnerPermissionQuery = gql`
  query partnerPermissionQuery($partnerId: ID!) {
    viewer {
      permissionsFromPartner(partnerId: $partnerId)
    }
  }
`;

export default partnerPermissionQuery;
