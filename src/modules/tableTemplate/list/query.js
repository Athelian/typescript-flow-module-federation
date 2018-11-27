import gql from 'graphql-tag';
import { tableTemplateCardFragment, userAvatarFragment } from 'graphql';

export const tableTemplateQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: MaskEditFilterInput, $sort: MaskEditSortInput) {
    maskEdits(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...tableTemplateCardFragment
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${userAvatarFragment}
  ${tableTemplateCardFragment}
`;

export default tableTemplateQuery;
