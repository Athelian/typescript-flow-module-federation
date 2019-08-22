// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import BaseCard from '../BaseCard';
import {
  InfoIconStyle,
  ProjectNameStyle,
  ProjectDueDateStyle,
  ProjectCardHeaderStyle,
  ProjectCardBodyStyle,
  ProjectCardStyle,
  TimelineStyle,
  MilestoneNameStyle,
  ProgressBarStyle,
  TasksWrapperStyle,
  DateStyle,
  BarStyle,
  MilestoneTickStyle,
  CompletedTasksStyle,
  TotalTasksStyle,
  TaskIconStyle,
  TagsWrapperStyle,
} from './style';

type Props = {
  project: Object,
};

// FIXME: this is a copy
const calculatePercentage = (total: number, completed: number) => {
  if (total) {
    if (completed >= total) return 100;
    return Math.round((completed * 100) / total);
  }

  return 0;
};

const ProjectCardNew = ({ project }: Props) => {
  const { name, dueDate, tags = [], milestones = [] } = project;
  return (
    <BaseCard icon="PROJECT" color="PROJECT">
      <div className={ProjectCardStyle}>
        <div className={ProjectCardHeaderStyle}>
          <div className={ProjectNameStyle}>{name}</div>
          <div className={ProjectDueDateStyle}>
            <div>
              <FormattedMessage id="components.card.due" defaultMessage="DUE" />
            </div>
            <div>{dueDate}</div>
            {/* TODO: calculate */}
            {/* Icon tooltips */}
            <Tooltip message={<div>12312</div>}>
              <div className={InfoIconStyle}>
                <Icon icon="INFO" />
              </div>
            </Tooltip>
          </div>
          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
        <Divider />
        <div className={ProjectCardBodyStyle}>
          {milestones.map(milestone => (
            <div className={TimelineStyle}>
              <div className={MilestoneNameStyle(milestone.isCompleted)}>{milestone.name}</div>
              <div className={ProgressBarStyle}>
                <div
                  className={BarStyle(calculatePercentage(milestone.total, milestone.completed))}
                />
                <div className={MilestoneTickStyle(milestone.isCompleted)}>
                  <Icon icon="CONFIRM" />
                </div>
              </div>
              <div className={TasksWrapperStyle(milestone.isCompleted)}>
                <div className={CompletedTasksStyle(milestone.isCompleted, milestone.completed)}>
                  {milestone.completed}
                </div>
                <div
                  className={TotalTasksStyle(milestone.isCompleted)}
                >{`/ ${milestone.total}`}</div>
                <div className={TaskIconStyle(milestone.isCompleted)}>
                  <Icon icon="TASK" />
                </div>
              </div>
              <div className={DateStyle}>
                <FormattedMessage id="components.card.due" defaultMessage="DUE" />
                <div>{milestone.dueDate}</div>
              </div>
              <div className={DateStyle}>
                {milestone.isCompleted ? (
                  <>
                    <FormattedMessage id="components.card.compl" defaultMessage="COMPL." />
                    <div>{milestone.completedAt}</div>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="components.card.est." defaultMessage="EST." />
                    <div>{milestone.estDate}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default ProjectCardNew;
