// @flow
import * as React from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import { compact } from 'lodash';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import { TimelineDateWrapperStyle, DateStyle, DelayStyle, ApprovedIconStyle } from './style';

type OptionalProps = {};

type Props = OptionalProps & {
  timelineDate: {
    date: ?string | Date,
    timelineDateRevisions: Array<{
      date: ?string | Date,
    }>,
    approvedAt: ?string | Date,
  },
};

const TimelineDate = ({ timelineDate }: Props) => {
  const { date, timelineDateRevisions: rawRevisions, approvedAt } = timelineDate;

  const timelineDateRevisions = compact(rawRevisions);
  const hasMultipleDates = timelineDateRevisions && timelineDateRevisions.length > 0;

  let shownDate = date;
  if (hasMultipleDates && timelineDateRevisions) {
    for (let index = timelineDateRevisions.length - 1; index >= 0; index -= 1) {
      const { date: lastDate } = timelineDateRevisions[index] || {};
      if (lastDate) {
        shownDate = lastDate;
        break;
      }
    }
  }

  let delayAmount = 0;
  if (date && shownDate && hasMultipleDates) {
    delayAmount = differenceInDays(new Date(shownDate), new Date(date));
  }

  return (
    <div className={TimelineDateWrapperStyle}>
      <div className={DateStyle(!!shownDate)}>
        <FormattedDate value={shownDate} mode="date" />
      </div>
      <div className={DelayStyle(delayAmount)}>
        {delayAmount !== 0 && `${delayAmount > 0 ? '+' : ''}${delayAmount}`}
      </div>
      {approvedAt && (
        <div className={ApprovedIconStyle(!!approvedAt)}>
          <Icon icon="CHECKED" />
        </div>
      )}
    </div>
  );
};

export default TimelineDate;
