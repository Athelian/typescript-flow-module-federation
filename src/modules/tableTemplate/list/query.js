import gql from 'graphql-tag';
import { tableTemplateCardFragment } from 'graphql';

export const tableTemplateQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: MaskEditFilterInput, $sortBy: MaskEditSortInput) {
    maskEdits(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
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

  ${tableTemplateCardFragment}
`;

export default tableTemplateQuery;
