// @flow
import gql from 'graphql-tag';
import {
  milestoneCardFragment,
  projectCardFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskCountFragment,
  userAvatarFragment,
  tagFragment,
  forbiddenFragment,
} from 'graphql';

export const shipmentFormTasksQuery = gql`
  query shipmentFormTasksQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        todo {
          milestone {
            ... on Milestone {
              ...milestoneCardFragment
              project {
                ...projectCardFragment
              }
            }
          }
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
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export default shipmentFormTasksQuery;
