// @flow
import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Tooltip } from 'components/Tooltip';
import { diffDueDate } from 'utils/ui';
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

type OptionalProps = {
  onClick: Function,
};

type Props = OptionalProps & {
  project: Object,
};

const ProjectCardNew = ({ project, onClick }: Props) => {
  const { name, dueDate, tags = [], milestones = [] } = project;
  // milestones at latest one milestone
  const lastMileStone = milestones[milestones.length - 1];
  const {
    isCompleted: isLastMilestoneCompleted,
    completedAt: lastMilestoneCompletedAt,
    estDate: lastMilestoneEstDate,
  } = lastMileStone;

  const { value: dueDateDiff, color } = isLastMilestoneCompleted
    ? diffDueDate({ dueDate, date: lastMilestoneCompletedAt })
    : diffDueDate({ dueDate, date: lastMilestoneEstDate });

  return (
    <BaseCard icon="PROJECT" color="PROJECT" onClick={onClick}>
      <div className={ProjectCardStyle}>
        <div className={ProjectCardHeaderStyle}>
          <div className={ProjectNameStyle}>{name}</div>
          <div className={ProjectDueDateStyle}>
            <div>
              <FormattedMessage id="components.card.due" defaultMessage="DUE" />
            </div>
            {dueDate ? <FormattedDate value={dueDate} /> : 'N/A'}
            {dueDateDiff !== 0 && <div className={DiffDateStyle(color)}>{dueDateDiff}</div>}
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
