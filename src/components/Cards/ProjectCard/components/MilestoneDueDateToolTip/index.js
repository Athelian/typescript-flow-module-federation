// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { diffDueDate } from 'utils/ui';
import FormattedDate from 'components/FormattedDate';
import { TooltipGridStyle, ToolTipDiffDateStyle } from 'components/Cards/ProjectCard/style';

type Props = {
  dueDate: string,
  completedAt: ?string,
  estDate: ?string,
};

const MilestoneDueDateDiffToolTip = ({ dueDate, completedAt, estDate }: Props) => {
  const diffDueDateAndEstDate = diffDueDate({ dueDate, date: estDate });
  const diffDueDateAndCompletedAt = diffDueDate({ dueDate, date: completedAt });

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
        <div className={ToolTipDiffDateStyle(diffDueDateAndEstDate.color)}>
          {diffDueDateAndEstDate.value}
        </div>
        <div>
          {<FormattedMessage id="components.cards.completedDate" defaultMessage="Completed Date" />}
        </div>
        <div>{completedAt ? <FormattedDate value={completedAt} /> : 'N/A'}</div>
        <div className={ToolTipDiffDateStyle(diffDueDateAndCompletedAt.color)}>
          {diffDueDateAndCompletedAt.value}
        </div>
      </div>
    </div>
  );
};

export default MilestoneDueDateDiffToolTip;
