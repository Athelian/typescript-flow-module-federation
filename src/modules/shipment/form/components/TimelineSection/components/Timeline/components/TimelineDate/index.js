// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { compact } from 'lodash';
import { differenceInCalendarDays } from 'utils/date';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import FormattedDateTZ from 'components/FormattedDateTZ';
import FormattedNumber from 'components/FormattedNumber';
import { getLatestDate } from 'utils/shipment';
import type { UserPayload } from 'generated/graphql';
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
  color: string,
  vertical: boolean,
  mode?: 'datetime',
};

type Props = OptionalProps & {
  user: UserPayload,
};

const defaultProps = {
  prefixIcon: '',
  timelineDate: {
    date: null,
    timelineDateRevisions: [],
    approvedAt: null,
  },
  color: 'BLACK',
  vertical: false,
};

const TimelineDate = ({ timelineDate, prefixIcon, mode, vertical, color, user }: Props) => {
  const showTime = mode === 'datetime';
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
      {shownDate ? (
        <div className={DateStyle({ color, vertical, showTime })}>
          {showTime ? (
            <FormattedDate mode={mode} value={new Date(shownDate)} />
          ) : (
            <FormattedDateTZ value={shownDate} user={user} />
          )}
        </div>
      ) : (
        <div className={DateStyle({ color: 'GRAY_LIGHT', vertical, showTime })}>
          <FormattedMessage id="modules.Shipments.noDate" defaultMessage="No date" />
        </div>
      )}
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
