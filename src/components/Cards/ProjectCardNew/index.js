// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'date-fns';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import ProjectDueDateDiffToolTip from './components/ProjectDueDateDiffToolTip';
import MilestoneDueDateToolTip from './components/MilestoneDueDateToolTip';
import BaseCard from '../BaseCard';
import {
  InfoIconStyle,
  ProjectNameStyle,
  ProjectDueDateStyle,
  DiffDateStyle,
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
  MilestoneDiffDateStyle,
  MilestoneDateStyle,
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
  // milestones at latest one milestone
  const lastMileStone = milestones[milestones.length - 1];
  const {
    isCompleted: isLastMilestoneCompleted,
    completedAt: lastMilestoneCompletedAt,
    estDate: lastMilestoneEstDate,
  } = lastMileStone;
  const projectDueDateDiff = isLastMilestoneCompleted
    ? differenceInCalendarDays(new Date(lastMilestoneCompletedAt), new Date(dueDate))
    : differenceInCalendarDays(new Date(lastMilestoneEstDate), new Date(dueDate));

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
            {projectDueDateDiff !== 0 && (
              <div className={DiffDateStyle(projectDueDateDiff)}>
                {projectDueDateDiff > 0 && '+'}
                {projectDueDateDiff}
              </div>
            )}
            <Tooltip
              message={
                <ProjectDueDateDiffToolTip
                  projectDueDate={dueDate}
                  lastMilestoneEstDate={lastMilestoneEstDate}
                  lastMilestoneCompletedAt={lastMilestoneCompletedAt}
                />
              }
            >
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
          {milestones.map(milestone => {
            const {
              id,
              dueDate: milestoneDueDate,
              estDate: milestoneEstDate,
              completedAt: milestoneCompletedAt,
            } = milestone;
            const diffDueDateAndEstDate = milestoneEstDate
              ? differenceInCalendarDays(new Date(milestoneEstDate), new Date(milestoneDueDate))
              : 0;
            const diffDueDateAndCompletedAt = milestoneCompletedAt
              ? differenceInCalendarDays(new Date(milestoneCompletedAt), new Date(milestoneDueDate))
              : 0;

            return (
              <div key={id} className={TimelineStyle}>
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
                <Tooltip
                  message={
                    <MilestoneDueDateToolTip
                      dueDate={milestone.dueDate}
                      estDate={milestone.estDate}
                      completedAt={milestone.completedAt}
                      diffDueDateAndEstDate={diffDueDateAndEstDate}
                      diffDueDateAndCompletedAt={diffDueDateAndCompletedAt}
                    />
                  }
                >
                  <div>
                    <div className={DateStyle}>
                      <FormattedMessage id="components.card.due" defaultMessage="DUE" />
                      <div>{milestone.dueDate}</div>
                    </div>

                    <div className={DateStyle}>
                      {milestone.isCompleted ? (
                        <>
                          <FormattedMessage id="components.card.compl" defaultMessage="COMPL." />
                          <div className={MilestoneDateStyle}>
                            {milestone.completedAt}
                            {diffDueDateAndCompletedAt !== 0 && (
                              <span className={MilestoneDiffDateStyle(diffDueDateAndCompletedAt)}>
                                {diffDueDateAndCompletedAt > 0 && '+'}
                                {diffDueDateAndCompletedAt}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <FormattedMessage id="components.card.est." defaultMessage="EST." />
                          <div className={MilestoneDateStyle}>
                            {milestone.estDate}
                            {diffDueDateAndEstDate !== 0 && (
                              <span className={MilestoneDiffDateStyle(diffDueDateAndEstDate)}>
                                {diffDueDateAndEstDate > 0 && '+'}
                                {diffDueDateAndEstDate}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
};

export default ProjectCardNew;
