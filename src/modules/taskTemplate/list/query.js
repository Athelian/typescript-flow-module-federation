// @flow
import gql from 'graphql-tag';
import {
  taskTemplateCardFragment,
  userAvatarFragment,
  taskFormInTemplateFragment,
  tagFragment,
  forbiddenFragment,
} from 'graphql';

export const taskTemplateListQuery = gql`
  query taskTemplates(
    $page: Int!
    $perPage: Int!
    $filterBy: TaskTemplateFilterInput
    $sortBy: TaskTemplateSortInput
  ) {
    taskTemplates(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...taskTemplateCardFragment
      }
      page
      totalPage
    }
  }

  ${taskTemplateCardFragment}
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export default taskTemplateListQuery;
