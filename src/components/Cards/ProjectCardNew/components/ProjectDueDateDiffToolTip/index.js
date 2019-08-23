// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import { TooltipGridStyle, DiffDateStyle } from './style';

type Props = {
  projectDueDate: string,
  lastMilestoneCompletedAt: ?string,
  lastMilestoneEstDate: ?string,
};

const ProjectDueDateDiffToolTip = ({
  projectDueDate,
  lastMilestoneCompletedAt,
  lastMilestoneEstDate,
}: Props) => {
  const diffDueDateAndEstDate = lastMilestoneEstDate
    ? differenceInCalendarDays(new Date(lastMilestoneEstDate), new Date(projectDueDate))
    : 'N/A';
  const diffDueDateAndCompletedAt = lastMilestoneCompletedAt
    ? differenceInCalendarDays(new Date(lastMilestoneCompletedAt), new Date(projectDueDate))
    : 'N/A';

  return (
    <div>
      <div className={TooltipGridStyle}>
        <div>
          <FormattedMessage id="components.cards.dueDate" defaultMessage="Due Date" />
        </div>
        <div>
          <FormattedDate value={projectDueDate} />
        </div>
        <div>
          <FormattedMessage id="components.card.diffWDue" defaultMessage="Diff. w/Due" />
        </div>
        <div>
          <FormattedMessage
            id="components.card.lastMilestoneEst"
            defaultMessage="Last Milestone's Est. Compl. Date"
          />
        </div>
        <div>
          <FormattedDate value={lastMilestoneEstDate} />
        </div>
        <div className={DiffDateStyle(diffDueDateAndEstDate)}>
          {diffDueDateAndEstDate > 0 && '+'}
          {diffDueDateAndEstDate}
        </div>
        <div>
          {
            <FormattedMessage
              id="components.cards.lastMilestoneCompletedDate"
              defaultMessage="Last Milestone's Completed Date"
            />
          }
        </div>
        <div>{lastMilestoneCompletedAt || 'N/A'}</div>
        <div className={DiffDateStyle(diffDueDateAndCompletedAt)}>
          {diffDueDateAndCompletedAt > 0 && '+'}
          {diffDueDateAndCompletedAt}
        </div>
      </div>
    </div>
  );
};

export default ProjectDueDateDiffToolTip;
