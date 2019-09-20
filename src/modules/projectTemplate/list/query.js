// @flow
import gql from 'graphql-tag';

import { projectTemplateCardFragment } from 'graphql/projectTemplate/fragment';

export const projectTemplateListQuery = gql`
  query projectTemplateListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProjectTemplateFilterInput
    $sortBy: ProjectTemplateSortInput
  ) {
    projectTemplates(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...projectTemplateCardFragment
      }
      page
      totalPage
    }
  }

  ${projectTemplateCardFragment}
`;

export default projectTemplateListQuery;
