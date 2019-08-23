// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import { TooltipGridStyle, DiffDateStyle } from './style';

type Props = {
  dueDate: string,
  completedAt: string,
  estDate: string,
  diffDueDateAndEstDate: string,
  diffDueDateAndCompletedAt: string,
};

const MilestoneDueDateDiffToolTip = ({
  dueDate,
  completedAt,
  estDate,
  diffDueDateAndEstDate,
  diffDueDateAndCompletedAt,
}: Props) => {
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
        <div className={DiffDateStyle(diffDueDateAndEstDate)}>
          {diffDueDateAndEstDate > 0 && '+'}
          {diffDueDateAndEstDate}
        </div>
        <div>
          {<FormattedMessage id="components.cards.completedDate" defaultMessage="Completed Date" />}
        </div>
        <div>{completedAt ? <FormattedDate value={completedAt} /> : 'N/A'}</div>
        <div className={DiffDateStyle(diffDueDateAndCompletedAt)}>
          {diffDueDateAndCompletedAt > 0 && '+'}
          {diffDueDateAndCompletedAt}
        </div>
      </div>
    </div>
  );
};

export default MilestoneDueDateDiffToolTip;
