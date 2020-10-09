// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { UserPayload } from 'generated/graphql';
import { diffDueDate } from 'utils/ui';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { TooltipGridStyle, ToolTipDiffDateStyle } from 'components/Cards/ProjectCard/style';

type Props = {
  dueDate: string,
  completedAt: ?string,
  estDate: ?string,
  user: UserPayload,
};

const MilestoneDueDateDiffToolTip = ({ dueDate, completedAt, estDate, user }: Props) => {
  const diffDueDateAndEstDate = diffDueDate({ dueDate, date: estDate });
  const diffDueDateAndCompletedAt = diffDueDate({ dueDate, date: completedAt });

  return (
    <div>
      <div className={TooltipGridStyle}>
        <div>
          <FormattedMessage id="components.cards.dueDate" defaultMessage="Due Date" />
        </div>
        <div>{dueDate ? <FormattedDateTZ value={dueDate} user={user} /> : 'N/A'}</div>
        <div>
          <FormattedMessage id="components.card.diffWDue" defaultMessage="Diff. w/Due" />
        </div>
        <div>
          <FormattedMessage id="components.card.estComplDate" defaultMessage="Est. Compl. Date" />
        </div>
        <div>{estDate ? <FormattedDateTZ value={estDate} user={user} /> : 'N/A'}</div>
        <div className={ToolTipDiffDateStyle(diffDueDateAndEstDate.color)}>
          {diffDueDateAndEstDate.value}
        </div>
        <div>
          <FormattedMessage id="components.cards.completedDate" defaultMessage="Completed Date" />
        </div>
        <div>{completedAt ? <FormattedDateTZ value={completedAt} user={user} /> : 'N/A'}</div>
        <div className={ToolTipDiffDateStyle(diffDueDateAndCompletedAt.color)}>
          {diffDueDateAndCompletedAt.value}
        </div>
      </div>
    </div>
  );
};

export default MilestoneDueDateDiffToolTip;
