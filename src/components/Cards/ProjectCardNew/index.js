// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'date-fns';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import ProjectDueDateDiffToolTip from './components/ProjectDueDateDiffToolTip';
import MilestoneBlock from './components/MilestoneBlock';
import BaseCard from '../BaseCard';
import {
  InfoIconStyle,
  ProjectNameStyle,
  ProjectDueDateStyle,
  DiffDateStyle,
  ProjectCardHeaderStyle,
  ProjectCardBodyStyle,
  ProjectCardStyle,
  TagsWrapperStyle,
} from './style';

type Props = {
  project: Object,
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

  let projectDueDateElement;
  if (isLastMilestoneCompleted) {
    if (dueDate && lastMilestoneCompletedAt) {
      const diffDate = differenceInCalendarDays(
        new Date(lastMilestoneCompletedAt),
        new Date(dueDate)
      );
      if (diffDate === 0) {
        projectDueDateElement = '';
      } else if (diffDate > 0) {
        projectDueDateElement = <div className={DiffDateStyle('RED')}>{`+${diffDate}`}</div>;
      } else {
        projectDueDateElement = <div className={DiffDateStyle('TEAL')}>{diffDate}</div>;
      }
    } else {
      projectDueDateElement = <div className={DiffDateStyle('GRAY')}>N/A</div>;
    }
  } else if (dueDate && lastMilestoneEstDate) {
    const diffDate = differenceInCalendarDays(new Date(lastMilestoneEstDate), new Date(dueDate));
    if (diffDate === 0) {
      projectDueDateElement = '';
    } else if (diffDate > 0) {
      projectDueDateElement = <div className={DiffDateStyle('RED')}>{`+${diffDate}`}</div>;
    } else {
      projectDueDateElement = <div className={DiffDateStyle('TEAL')}>{diffDate}</div>;
    }
  } else {
    projectDueDateElement = <div className={DiffDateStyle('GRAY')}>N/A</div>;
  }

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
            {projectDueDateElement}
            <Tooltip
              message={
                <ProjectDueDateDiffToolTip
                  dueDate={dueDate}
                  estDate={lastMilestoneEstDate}
                  completedAt={lastMilestoneCompletedAt}
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
          {milestones.map(milestone => (
            <MilestoneBlock key={milestone.key} milestone={milestone} />
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default ProjectCardNew;
