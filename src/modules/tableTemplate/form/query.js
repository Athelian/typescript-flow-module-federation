// @flow
import gql from 'graphql-tag';
import { tableTemplateFormFragment, userAvatarFragment } from 'graphql';

export const tableTemplateFormQuery = gql`
  query($id: ID!) {
    maskEdit(id: $id) {
      ...tableTemplateFormFragment
    }
  }

  ${tableTemplateFormFragment}
  ${userAvatarFragment}
`;

export default tableTemplateFormQuery;
