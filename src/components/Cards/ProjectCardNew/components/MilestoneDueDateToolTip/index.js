// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { differenceInCalendarDays } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import { TooltipGridStyle, ToolTipDiffDateStyle } from 'components/Cards/ProjectCardNew/style';

type Props = {
  dueDate: string,
  completedAt: ?string,
  estDate: ?string,
};

const MilestoneDueDateDiffToolTip = ({ dueDate, completedAt, estDate }: Props) => {
  let diffDueDateAndCompletedAt;
  if (dueDate && completedAt) {
    const diffDate = differenceInCalendarDays(new Date(completedAt), new Date(dueDate));
    if (diffDate === 0) {
      diffDueDateAndCompletedAt = '';
    } else if (diffDate > 0) {
      diffDueDateAndCompletedAt = (
        <div className={ToolTipDiffDateStyle('RED')}>{`+${diffDate}`}</div>
      );
    } else {
      diffDueDateAndCompletedAt = <div className={ToolTipDiffDateStyle('TEAL')}>{diffDate}</div>;
    }
  } else {
    diffDueDateAndCompletedAt = <div className={ToolTipDiffDateStyle('GRAY')}>N/A</div>;
  }

  let diffDueDateAndEstDate;
  if (dueDate && estDate) {
    const diffDate = differenceInCalendarDays(new Date(estDate), new Date(dueDate));
    if (diffDate === 0) {
      diffDueDateAndEstDate = <div className={ToolTipDiffDateStyle('GRAY')}>0</div>;
    } else if (diffDate > 0) {
      diffDueDateAndEstDate = <div className={ToolTipDiffDateStyle('RED')}>{`+${diffDate}`}</div>;
    } else {
      diffDueDateAndEstDate = <div className={ToolTipDiffDateStyle('TEAL')}>{diffDate}</div>;
    }
  } else {
    diffDueDateAndEstDate = <div className={ToolTipDiffDateStyle('GRAY')}>N/A</div>;
  }

  return (
    <div>
      <div className={TooltipGridStyle}>
        <div>
          <FormattedMessage id="components.cards.dueDate" defaultMessage="Due Date" />
        </div>
        <div>{dueDate ? <FormattedDate value={dueDate} /> : 'N/A'}</div>
        <div>
          <FormattedMessage id="components.card.diffWDue" defaultMessage="Diff. w/Due" />
        </div>
        <div>
          <FormattedMessage id="components.card.estComplDate" defaultMessage="Est. Compl. Date" />
        </div>
        <div>{estDate ? <FormattedDate value={estDate} /> : 'N/A'}</div>
        {diffDueDateAndEstDate}
        <div>
          {<FormattedMessage id="components.cards.completedDate" defaultMessage="Completed Date" />}
        </div>
        <div>{completedAt ? <FormattedDate value={completedAt} /> : 'N/A'}</div>
        {diffDueDateAndCompletedAt}
      </div>
    </div>
  );
};

export default MilestoneDueDateDiffToolTip;
