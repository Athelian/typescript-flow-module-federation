// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  createdAt: {
    id: 'modules.Projects.createdAt',
    defaultMessage: 'Date Created',
  },
  updatedAt: {
    id: 'modules.Projects.updatedAt',
    defaultMessage: 'Last Modified',
  },
  name: {
    id: 'modules.Projects.name',
    defaultMessage: 'Name',
  },
  dueDate: {
    id: 'modules.Projects.dueDate',
    defaultMessage: 'Due Date',
  },
  archived: {
    id: 'modules.Projects.archived',
    defaultMessage: 'Archived',
  },
  status: {
    id: 'modules.Projects.status',
    defaultMessage: 'Status',
  },
  activateDialog: {
    id: 'modules.Projects.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {project}?',
  },
  archiveDialog: {
    id: 'modules.Projects.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {project}?',
  },
  lastMilestoneDueDate: {
    id: 'modules.Projects.lastMilestoneDueDate',
    defaultMessage: 'Last Milestone Due Date',
  },
  tags: {
    id: 'modules.Projects.tags',
    defaultMessage: 'Tags',
  },
  tagsWithout: {
    id: 'modules.Projects.tagsWithout',
    defaultMessage: 'Tags without',
  },
  logs: {
    id: 'modules.Projects.logs',
    defaultMessage: 'Logs',
  },
  description: {
    id: 'modules.Projects.description',
    defaultMessage: 'Description',
  },
  followers: {
    id: 'modules.Projects.followers',
    defaultMessage: 'Followers',
  },
  owner: {
    id: 'modules.Projects.owner',
    defaultMessage: 'Owner',
  },
  sharedPartners: {
    id: 'modules.Projects.sharedPartners',
    defaultMessage: 'SHARED PARTNERS',
  },
  sharedPartnersTooltip: {
    id: 'modules.Projects.sharedPartners.tooltip',
    defaultMessage: 'You can choose up to 4 Partners. This will grant them access to this project.',
  },
  diffBetweenLastMilestoneAndProjectDueDate: {
    id: 'modules.Projects.diffBetweenLastMilestoneAndProjectDueDate',
    defaultMessage: ' days difference between Project Due Date and Last Milestone Due Date',
  },
  repeat: {
    id: 'modules.Projects.sheet.repeat',
    defaultMessage: 'Repeat',
  },
  projectSticky: {
    id: 'modules.Projects.sheet.projectSticky',
    defaultMessage: 'Project',
  },
  milestoneSticky: {
    id: 'modules.Projects.sheet.milestoneSticky',
    defaultMessage: 'Milestone {milestone}',
  },
  taskSticky: {
    id: 'modules.Projects.sheet.taskSticky',
    defaultMessage: 'Task {task} of milestone {milestone}',
  },
});
