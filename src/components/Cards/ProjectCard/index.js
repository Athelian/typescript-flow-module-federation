// @flow
import * as React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Display, Label } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import { differenceInCalendarDays } from 'utils/date';
import ProjectDueDateDiffToolTip from './components/ProjectDueDateDiffToolTip';
import MilestoneTimelineItem from './components/MilestoneTimelineItem';
import BaseCard from '../BaseCard';
import {
  ProjectCardStyle,
  ProjectCardHeaderStyle,
  ProjectDueDateStyle,
  DiffDateStyle,
  InfoIconStyle,
  TagsWrapperStyle,
  DividerStyle,
  ProjectCardBodyStyle,
} from './style';

type Props = {|
  project: Object,
  onClick: Function,
  selectable?: boolean,
  selected?: boolean,
  actions: Array<React.Node>,
  showActionsOnHover: boolean,
|};

const ProjectCard = ({ project, onClick, ...rest }: Props) => {
  const { name, dueDate, tags = [], milestones = [] } = project;

  const lastMilestone = milestones[milestones.length - 1];
  let lastMilestoneDiff = 0;
  if (dueDate && lastMilestone.completedAt) {
    lastMilestoneDiff = differenceInCalendarDays(
      new Date(lastMilestone.completedAt),
      new Date(dueDate)
    );
  } else if (dueDate && lastMilestone.estimatedCompletionDate) {
    lastMilestoneDiff = differenceInCalendarDays(
      new Date(lastMilestone.estimatedCompletionDate),
      new Date(dueDate)
    );
  }

  return (
    <BaseCard
      showBadge={project.timeline?.unreadCount > 0}
      icon="PROJECT"
      color="PROJECT"
      onClick={onClick}
      {...rest}
    >
      <div className={ProjectCardStyle}>
        <div className={ProjectCardHeaderStyle}>
          <Display width="200px" height="20px">
            {name}
          </Display>

          <div className={ProjectDueDateStyle}>
            <Label width="40px" height="20px">
              <FormattedMessage id="components.card.due" defaultMessage="DUE" />
            </Label>

            <Display width="80px" height="20px">
              {dueDate ? (
                <FormattedDate value={dueDate} />
              ) : (
                <FormattedMessage id="component.cards.na" defaultMessage="N/A" />
              )}
            </Display>

            <div className={DiffDateStyle(lastMilestoneDiff)}>
              {lastMilestoneDiff > 0 && '+'}
              {lastMilestoneDiff !== 0 && lastMilestoneDiff}
            </div>

            {lastMilestoneDiff !== 0 && (
              <Tooltip
                message={
                  <ProjectDueDateDiffToolTip
                    dueDate={dueDate}
                    estDate={lastMilestone.estCompletedAt}
                    completedAt={lastMilestone.completedAt}
                  />
                }
              >
                <div className={InfoIconStyle}>
                  <Icon icon="INFO" />
                </div>
              </Tooltip>
            )}
          </div>

          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        </div>

        <div className={DividerStyle} />

        <div className={ProjectCardBodyStyle(milestones.length)}>
          {milestones.map(milestone => (
            <MilestoneTimelineItem key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default ProjectCard;
