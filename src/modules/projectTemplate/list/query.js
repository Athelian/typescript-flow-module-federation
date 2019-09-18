// @flow
import gql from 'graphql-tag';

import { projectTemplateFormFragment } from 'graphql/projectTemplate/fragment';

export const projectTemplateListQuery = gql`
  query projectTemplateListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProjectTemplateFilterInput
    $sortBy: ProjectTemplateSortInput
  ) {
    projectTemplates(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...projectTemplateFormFragment
      }
      page
      totalPage
    }
  }

  ${projectTemplateFormFragment}
`;

export default projectTemplateListQuery;
