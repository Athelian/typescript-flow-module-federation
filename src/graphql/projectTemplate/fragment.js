// @flow
import gql from 'graphql-tag';
import { tagFragment, userAvatarFragment } from 'graphql/common/fragment';

const milestoneTemplateFormFragment = gql`
  fragment milestoneTemplateFormFragment on MilestoneTemplate {
    id
    name
    description
    dueDateBinding
    dueDateInterval {
      months
      weeks
      days
    }
    estimatedCompletionDateBinding
    estimatedCompletionDateInterval {
      months
      weeks
      days
    }
    sort
  }
`;

export const projectTemplateFormFragment = gql`
  fragment projectTemplateFormFragment on ProjectTemplate {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }

    name
    description
    tags {
      ...tagFragment
    }
    milestones {
      ...milestoneTemplateFormFragment
    }
  }
  ${userAvatarFragment}
  ${tagFragment}
  ${milestoneTemplateFormFragment}
`;

export default projectTemplateFormFragment;
