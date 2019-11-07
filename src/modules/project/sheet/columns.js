/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import projectMessages from 'modules/project/messages';
import milestoneMessages from 'modules/milestone/messages';
import taskMessages from 'modules/task/messages';

const projectColumns: Array<ColumnConfig> = [
  {
    key: 'project.created',
    title: <FormattedMessage {...projectMessages.createdAt} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 110,
  },
  {
    key: 'project.updated',
    title: <FormattedMessage {...projectMessages.updatedAt} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 110,
  },
  {
    key: 'project.name',
    title: <FormattedMessage {...projectMessages.name} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
  },
  {
    key: 'project.description',
    title: <FormattedMessage {...projectMessages.description} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
  },
  {
    key: 'project.dueDate',
    title: <FormattedMessage {...projectMessages.dueDate} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 125,
  },
  {
    key: 'project.tags',
    title: <FormattedMessage {...projectMessages.tags} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 200,
  },
  {
    key: 'project.logs',
    title: <FormattedMessage {...projectMessages.logs} />,
    icon: 'PROJECT',
    color: colors.PROJECT,
    width: 120,
  },
  // actions
];

const milestoneColumns: Array<ColumnConfig> = [
  {
    key: 'project.milestone.created',
    title: <FormattedMessage {...milestoneMessages.createdAt} />,
    icon: 'MILESTONE',
    color: colors.MILESTONE,
    width: 110,
  },
  {
    key: 'project.milestone.updated',
    title: <FormattedMessage {...milestoneMessages.updatedAt} />,
    icon: 'MILESTONE',
    color: colors.MILESTONE,
    width: 110,
  },
  {
    key: 'project.milestone.name',
    title: <FormattedMessage {...milestoneMessages.name} />,
    icon: 'MILESTONE',
    color: colors.MILESTONE,
    width: 200,
  },
  {
    key: 'project.milestone.description',
    title: <FormattedMessage {...milestoneMessages.description} />,
    icon: 'MILESTONE',
    color: colors.MILESTONE,
    width: 200,
  },
  // dueDate + binding
  // estimatedCompletionDate + binding
  // completed
  {
    key: 'project.milestone.files',
    title: <FormattedMessage {...milestoneMessages.files} />,
    icon: 'MILESTONE',
    color: colors.MILESTONE,
    width: 200,
  },
  // actions
];

const taskColumns: Array<ColumnConfig> = [
  {
    key: 'project.milestone.task.created',
    title: <FormattedMessage {...taskMessages.createdAt} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 110,
  },
  {
    key: 'project.milestone.task.updated',
    title: <FormattedMessage {...taskMessages.updatedAt} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 110,
  },
  {
    key: 'project.milestone.task.name',
    title: <FormattedMessage {...taskMessages.name} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: 'project.milestone.task.description',
    title: <FormattedMessage {...taskMessages.description} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 200,
  },
  // start date + binding
  // due date + binding
  // in progress
  // completed
  // rejected
  // skipped
  {
    key: 'project.milestone.task.approvable',
    title: <FormattedMessage {...taskMessages.approvable} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 200,
  },
  // approved
  // approvers
  {
    key: 'project.milestone.task.tags',
    title: <FormattedMessage {...taskMessages.tags} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 200,
  },
  {
    key: 'project.milestone.task.logs',
    title: <FormattedMessage {...taskMessages.logs} />,
    icon: 'TASK',
    color: colors.TASK,
    width: 120,
  },
  // actions
];

const columns: Array<ColumnConfig> = [...projectColumns, ...milestoneColumns, ...taskColumns];

export default columns;
