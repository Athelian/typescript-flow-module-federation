// @flow
import gql from 'graphql-tag';
import { partnerFormFragment } from 'graphql';

export const partnerFormQuery = gql`
  query partnerFormQuery($id: ID!) {
    partner(id: $id) {
      ...partnerFormFragment
    }
  }

  ${partnerFormFragment}
`;

export default partnerFormQuery;
