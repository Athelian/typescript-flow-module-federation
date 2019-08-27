// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { compact } from 'lodash';
import { differenceInCalendarDays } from 'utils/date';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { getLatestDate } from 'utils/shipment';
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
    date: null,
    timelineDateRevisions: [],
    approvedAt: null,
  },
  vertical: false,
};

const TimelineDate = ({ timelineDate, prefixIcon, vertical }: Props) => {
  const { date, timelineDateRevisions: rawRevisions, approvedAt } = timelineDate;

  const timelineDateRevisions = compact(rawRevisions);
  const hasMultipleDates = timelineDateRevisions && timelineDateRevisions.length > 0;

  const shownDate = getLatestDate(timelineDate);

  let delayAmount = 0;
  if (date && shownDate && hasMultipleDates) {
    delayAmount = differenceInCalendarDays(new Date(shownDate), new Date(date));
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
        {delayAmount !== 0 && (
          <>
            {delayAmount > 0 ? '+' : ''}
            <FormattedNumber value={delayAmount} />
          </>
        )}
      </div>

      <div className={ApprovedIconStyle({ approved: !!approvedAt, vertical })}>
        <Icon icon="CHECKED" />
      </div>
    </div>
  );
};

TimelineDate.defaultProps = defaultProps;

export default TimelineDate;
