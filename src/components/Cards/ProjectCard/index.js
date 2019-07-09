// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isForbidden, isNotFound } from 'utils/data';
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

type OptionalProps = {
  onClick: Function,
};

type Props = OptionalProps & {
  project: {
    name: string,
    dueDate: string,
    milestones: Array<Object>,
    taskCount: {
      count: number,
      remain: number,
      inProgress: number,
      skipped: number,
      completed: number,
      delayed: number,
    },
    tags: Array<Object>,
  },
};

const ProjectCard = ({ project, onClick, ...rest }: Props) => {
  const { name, dueDate, milestones = [], taskCount = {}, tags = [] } = project;
  const { count, remain, inProgress, skipped, completed, delayed } = taskCount;

  return (
    <BaseCard icon="PROJECT" color="PROJECT" onClick={onClick} {...rest}>
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
                <FormattedNumber value={count} />
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
                <FormattedNumber value={delayed} />
              </Display>
            }
          />

          <div className={TaskStatusChartStyle}>
            <TaskStatusChart
              completed={completed}
              inProgress={inProgress}
              skipped={skipped}
              unCompleted={remain}
            />
          </div>

          <div className={TagsWrapperStyle}>
            {tags
              .filter(item => !isForbidden(item) && !isNotFound(item))
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
