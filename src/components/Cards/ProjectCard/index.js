// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Tag from 'components/Tag';
import { Display, Label } from 'components/Form';
import useUser from 'hooks/useUser';
import FormattedDateTZ from 'components/FormattedDateTZ';
import GridRow from 'components/GridRow';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import { calculateDateDifferenceInDays } from 'utils/date';
import ProjectDueDateDiffToolTip from './components/ProjectDueDateDiffToolTip';
import MilestoneTimelineItem from './components/MilestoneTimelineItem';
import BaseCard from '../BaseCard';
import {
  ProjectCardStyle,
  ProjectCardHeaderStyle,
  ProjectCardSubHeaderStyle,
  OwnerWrapperStyle,
  OwnerTextStyle,
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
  actions?: Array<React.Node>,
  showActionsOnHover?: boolean,
|};

const ProjectCard = ({ project, onClick, ...rest }: Props) => {
  const { user } = useUser();
  const { name, dueDate, tags = [], milestones = [], archived = false, ownedBy = {} } = project;

  let lastMilestoneDiff = 0;

  const lastMilestone = milestones.length ? milestones[milestones.length - 1] : {};

  if (dueDate && lastMilestone.completedAt) {
    lastMilestoneDiff = calculateDateDifferenceInDays(lastMilestone.completedAt, dueDate);
  } else if (dueDate && lastMilestone.estimatedCompletionDate) {
    lastMilestoneDiff = calculateDateDifferenceInDays(
      lastMilestone.estimatedCompletionDate,
      dueDate
    );
  }

  return (
    <BaseCard
      // showBadge={project.timeline?.unreadCount > 0}
      unreadMessageCount={project?.timeline?.unreadMessageCount}
      notificationUnseenCount={project?.notificationUnseenCount}
      notificationPosition="46px"
      icon="PROJECT"
      color="PROJECT"
      onClick={onClick}
      isArchived={archived}
      {...rest}
    >
      <div className={ProjectCardStyle}>
        <div className={ProjectCardHeaderStyle}>
          <Display width="200px" height="20px">
            <FullValueTooltip message={name}>
              <span>{name}</span>
            </FullValueTooltip>
          </Display>

          <div className={TagsWrapperStyle}>
            {tags.map(tag => (
              <Tag key={tag.id} tag={tag} />
            ))}
          </div>
        </div>

        <div className={ProjectCardSubHeaderStyle}>
          <GridRow>
            <FullValueTooltip message={name}>
              <div className={OwnerWrapperStyle}>
                <GridRow gap="5px">
                  <Label height="20px">
                    <FormattedMessage id="modules.Projects.owner" defaultMessage="OWNER" />
                  </Label>
                  <span className={OwnerTextStyle}>{ownedBy?.name || ''}</span>
                </GridRow>
              </div>
            </FullValueTooltip>

            <div className={ProjectDueDateStyle}>
              <Label width="40px" height="20px">
                <FormattedMessage id="components.card.due" defaultMessage="DUE" />
              </Label>

              <Display width="80px" height="20px">
                {dueDate ? (
                  <FormattedDateTZ value={dueDate} user={user} />
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
          </GridRow>
        </div>

        <div className={DividerStyle} />

        <div className={ProjectCardBodyStyle(milestones.length)}>
          {milestones.map(milestone => (
            <MilestoneTimelineItem key={milestone.id} milestone={milestone} user={user} />
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default ProjectCard;
