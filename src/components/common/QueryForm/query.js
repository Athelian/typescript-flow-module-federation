// @flow
import gql from 'graphql-tag';

export const partnerPermissionQuery = gql`
  query($partnerId: ID!) {
    viewer {
      permissionsFromPartner(partnerId: $partnerId)
    }
  }
`;

export default partnerPermissionQuery;
