// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';
import {
  projectTemplateCardFragment,
  projectTemplateFormFragment,
} from 'graphql/projectTemplate/fragment';

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
  ${forbiddenFragment}
`;

export const projectTemplateWholeInfoListQuery = gql`
  query projectTemplateWholeInfoListQuery(
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
  ${forbiddenFragment}
`;

export default projectTemplateListQuery;
