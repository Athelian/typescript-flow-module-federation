// @flow
import gql from 'graphql-tag';
import { warehouseFormFragment, userAvatarFragment, metricFragment } from 'graphql';

export const warehouseFormQuery = gql`
  query($id: ID!) {
    warehouse(id: $id) {
      ...warehouseFormFragment
    }
  }

  ${warehouseFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
`;

export default warehouseFormQuery;
