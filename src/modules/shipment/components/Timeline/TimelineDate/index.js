// @flow
import React from 'react';
import Icon from 'components/Icon';
import type { TimelineDate as TimelineDateType } from 'modules/shipment/type.js.flow';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import { getLastActualDate, getDistanceOfDays } from 'modules/shipment/components/helpers';
import {
  TimelineDateWrapperStyle,
  DateWrapperStyle,
  IconStyle,
  ActualDateStyle,
  EstimatedDateStyle,
  DelayStyle,
} from './style';

type Props = {
  timelineDate: TimelineDateType,
  align: 'left' | 'right',
};

const TimelineDate = ({ timelineDate, align }: Props) => {
  const { estimatedDate, approvedAt } = timelineDate;
  const actualDate = getLastActualDate(timelineDate);
  const approved = !!approvedAt;

  const dueDateWarning =
    !approved && actualDate
      ? getDistanceOfDays(actualDate, new Date()) > 0 &&
        getDistanceOfDays(actualDate, new Date()) < 5
      : estimatedDate &&
        getDistanceOfDays(estimatedDate, new Date()) > 0 &&
        getDistanceOfDays(estimatedDate, new Date()) < 5;

  let color = 'GRAY_LIGHT';
  if (approved) color = 'BLUE';
  if (dueDateWarning) color = 'ORANGE';

  const estimatedDateWarning =
    !approved &&
    !actualDate &&
    estimatedDate &&
    getDistanceOfDays(estimatedDate, new Date()) > 0 &&
    getDistanceOfDays(estimatedDate, new Date()) < 5;

  const delay = !estimatedDate || !actualDate ? 0 : -getDistanceOfDays(estimatedDate, actualDate);

  return (
    <div className={TimelineDateWrapperStyle}>
      <div className={DateWrapperStyle(align === 'left' ? 'flex-start' : 'flex-end')}>
        {align === 'right' &&
          actualDate && (
            <div className={IconStyle(color)}>
              <Icon icon="CHECKED" />
            </div>
          )}

        <div className={ActualDateStyle}>{/* <FormattedDate value={actualDate} /> */}</div>

        {align === 'left' &&
          actualDate && (
            <div className={IconStyle(color)}>
              <Icon icon="CHECKED" />
            </div>
          )}
      </div>

      <div className={DateWrapperStyle(align === 'left' ? 'flex-start' : 'flex-end')}>
        {align === 'right' &&
          (estimatedDateWarning ? (
            <div className={IconStyle(color)}>
              <Icon icon="WARNING" />
            </div>
          ) : (
            <div className={DelayStyle(delay)}>
              {delay > 0 && '+'}
              {delay !== 0 && <FormattedNumber value={delay} />}
            </div>
          ))}

        <div className={EstimatedDateStyle}>
          <FormattedDate value={estimatedDate} />
        </div>

        {align === 'left' &&
          (estimatedDateWarning ? (
            <div className={IconStyle(color)}>
              <Icon icon="WARNING" />
            </div>
          ) : (
            <div className={DelayStyle(delay)}>
              {delay > 0 && '+'}
              {delay !== 0 && <FormattedNumber value={delay} />}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TimelineDate;
