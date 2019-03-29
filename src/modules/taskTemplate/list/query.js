// @flow
import gql from 'graphql-tag';
import {
  taskTemplateCardFragment,
  userAvatarFragment,
  taskFormInTemplateFragment,
  tagFragment,
} from 'graphql';

export const taskTemplateListQuery = gql`
  query(
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
`;

export default taskTemplateListQuery;
