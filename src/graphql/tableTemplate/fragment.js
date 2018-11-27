// @flow
import gql from 'graphql-tag';

export const tableTemplateCardFragment = gql`
  fragment tableTemplateCardFragment on MaskEdit {
    id
    name
    type
    memo
    fields
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
  }
`;

export default tableTemplateCardFragment;
