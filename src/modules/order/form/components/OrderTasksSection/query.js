// @flow
import gql from 'graphql-tag';
import {
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskCountFragment,
  userAvatarFragment,
  tagFragment,
  forbiddenFragment,
} from 'graphql';

export const orderFormTasksQuery = gql`
  query orderFormTasksQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        todo {
          taskCount {
            ...taskCountFragment
          }
          tasks {
            ...taskWithoutParentInfoFragment
            ...forbiddenFragment
          }
          taskTemplate {
            ...taskTemplateCardFragment
            ...forbiddenFragment
          }
        }
      }
    }
  }

  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export default orderFormTasksQuery;
