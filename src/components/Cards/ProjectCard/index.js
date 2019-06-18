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
import Tag from 'components/Tag';

import BaseCard from '../BaseCard';
import { ProjectCardStyle, ProjectNameStyle, CommonCardGridStyle, TagsWrapperStyle } from './style';

type Props = {
  data: {
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

const ProjectCard = ({ data }: Props) => {
  const { name, dueDate, milestones = [], taskCount, tags = [] } = data;

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
                <FormattedMessage id="components.cards.totalTasks" defaultMessage="TOTAL TASKS" />
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
                <FormattedMessage
                  id="components.cards.overdueTasks"
                  defaultMessage="OVERDUE TASKS"
                />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={overdueTasks} />
              </Display>
            }
          />

          <FieldItem
            vertical
            label={
              <Label>
                <FormattedMessage
                  id="components.cards.tasksCompletion"
                  defaultMessage="TASKS COMPLETION"
                />
              </Label>
            }
            input={
              <TaskStatusChart
                completed={completed}
                inProgress={inProgress}
                skipped={skipped}
                unCompleted={unCompleted}
              />
            }
          />

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

export default ProjectCard;
