// @flow
import gql from 'graphql-tag';
import {
  taskTemplateCardFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  todoFragment,
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
          ...todoFragment
          tasks {
            ...taskFormInSlideViewFragment
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

  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${todoFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export default orderFormTasksQuery;
