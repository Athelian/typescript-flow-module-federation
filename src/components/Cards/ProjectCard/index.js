// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isForbidden } from 'utils/data';
import { isBefore, startOfToday } from 'utils/date';
import { Display, FieldItem, Label } from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import Divider from 'components/Divider';
import TaskStatusChart from 'components/TaskStatusChart';
import withForbiddenCard from 'hoc/withForbiddenCard';
import Tag from 'components/Tag';
import BaseCard from '../BaseCard';
import {
  ProjectCardStyle,
  ProjectNameStyle,
  CommonCardGridStyle,
  TaskStatusChartStyle,
  TagsWrapperStyle,
} from './style';

type Props = {
  project: {
    name: string,
    dueDate: string,
    milestones: Array<Object>,
    taskCount: number,
    tags: Array<Object>,
  },
};

export const deStructureMilestones = (milestones: Array<Object>) => {
  let completed = 0;
  let inProgress = 0;
  let skipped = 0;
  let unCompleted = 0;
  let overdueTasks = 0;

  for (let i = 0; i < milestones.length; i += 1) {
    const { tasks = [] } = milestones[i];
    for (let j = 0; j < tasks.length; j += 1) {
      const { completedAt, inProgressAt, skippedAt, dueDate } = tasks[j];
      if (isBefore(new Date(dueDate), startOfToday())) {
        overdueTasks += 1;
      }

      if (completedAt) {
        completed += 1;
      } else if (inProgressAt) {
        inProgress += 1;
      } else if (skippedAt) {
        skipped += 1;
      } else {
        unCompleted += 1;
      }
    }
  }

  return {
    completed,
    inProgress,
    skipped,
    unCompleted,
    overdueTasks,
  };
};

const ProjectCard = ({ project }: Props) => {
  const { name, dueDate, milestones = [], taskCount, tags = [] } = project;

  const { completed, inProgress, skipped, unCompleted, overdueTasks } = deStructureMilestones(
    milestones
  );

  return (
    <BaseCard icon="PROJECT" color="PROJECT">
      <div className={ProjectCardStyle}>
        <div className={CommonCardGridStyle}>
          <div className={ProjectNameStyle}>
            <Display align="left">{name}</Display>
          </div>

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.dueDate" defaultMessage="DUE DATE" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={dueDate} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.milestones" defaultMessage="MILESTONES" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={milestones.length} />
              </Display>
            }
          />

          <Divider />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.tasks" defaultMessage="TASKS" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={taskCount} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.overdueTasks" defaultMessage="OVERDUE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={overdueTasks} />
              </Display>
            }
          />

          <div className={TaskStatusChartStyle}>
            <TaskStatusChart
              completed={completed}
              inProgress={inProgress}
              skipped={skipped}
              unCompleted={unCompleted}
            />
          </div>

          <div className={TagsWrapperStyle}>
            {tags
              .filter(item => !isForbidden(item))
              .map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default withForbiddenCard(ProjectCard, 'project', {
  width: '195px',
  height: '214px',
  entityIcon: 'PROJECT',
  entityColor: 'PROJECT',
});
