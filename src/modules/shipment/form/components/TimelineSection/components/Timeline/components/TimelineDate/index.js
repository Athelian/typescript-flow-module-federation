// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { compact } from 'lodash';
import differenceInDays from 'date-fns/differenceInDays';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import {
  TimelineDateWrapperStyle,
  PrefixIconStyle,
  DateStyle,
  DelayStyle,
  ApprovedIconStyle,
} from './style';

type OptionalProps = {
  prefixIcon: string,
  timelineDate: {
    date: ?string | Date,
    timelineDateRevisions?: Array<{
      date: ?string | Date,
    }>,
    approvedAt: ?string | Date,
  },
  vertical: boolean,
};

type Props = OptionalProps & {};

const defaultProps = {
  prefixIcon: '',
  timelineDate: {
    timelineDateRevisions: [],
  },
  vertical: false,
};

const TimelineDate = ({ timelineDate, prefixIcon, vertical }: Props) => {
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
    <div className={TimelineDateWrapperStyle(vertical)}>
      {vertical && (
        <div className={PrefixIconStyle}>{prefixIcon && <Icon icon={prefixIcon} />}</div>
      )}
      <div className={DateStyle({ shownDate: !!shownDate, vertical })}>
        {shownDate ? (
          <FormattedDate value={new Date(shownDate)} />
        ) : (
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        )}
      </div>
      <div className={DelayStyle({ delayAmount, vertical })}>
        {delayAmount !== 0 && `${delayAmount > 0 ? '+' : ''}${delayAmount}`}
      </div>

      <div className={ApprovedIconStyle({ approved: !!approvedAt, vertical })}>
        <Icon icon="CHECKED" />
      </div>
    </div>
  );
};

TimelineDate.defaultProps = defaultProps;

export default TimelineDate;
