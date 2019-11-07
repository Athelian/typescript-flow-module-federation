// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  tagFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';
import { batchSheetFragment } from 'modules/gtv/fragment';

export const batchesQuery = gql`
  query batchesQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...batchSheetFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${batchSheetFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export default batchesQuery;
