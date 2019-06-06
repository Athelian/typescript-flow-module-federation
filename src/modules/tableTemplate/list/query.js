import gql from 'graphql-tag';
import {
  tableTemplateCardFragment,
  userAvatarFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

export const tableTemplateQuery = gql`
  query tableTemplateQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: MaskEditFilterInput
    $sortBy: MaskEditSortInput
  ) {
    maskEdits(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...tableTemplateCardFragment
        ...forbiddenFragment
        ...badRequestFragment
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
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default tableTemplateQuery;
