// @flow
import gql from 'graphql-tag';

export const tableTemplateFragment = gql`
  fragment tableTemplateFragment on MaskEdit {
    id
    name
    type
    memo
    columns {
      ... on MaskEditColumn {
        key
        hidden
      }
    }
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
  }
`;

export default tableTemplateFragment;
