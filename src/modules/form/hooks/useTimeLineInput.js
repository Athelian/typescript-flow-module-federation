// @flow

import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { differenceInCalendarDays } from 'utils/date';

type TimeLineProps = {
  approvedBy?: {
    firstName: string,
    lastName: string,
  },
  date: ?Date,
  timelineDateRevisions?: Array<{
    date: ?Date,
    id: string,
  }>,
};

const findLatestDate = (initialValue: TimeLineProps) => {
  const { date, timelineDateRevisions } = initialValue;

  if (timelineDateRevisions && timelineDateRevisions.length) {
    return timelineDateRevisions[timelineDateRevisions.length - 1].date;
  }

  return date;
};

const findDelay = (timelineDateRevisions: Array<Object>, date: ?Date) => {
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
    delayAmount = differenceInCalendarDays(new Date(shownDate), new Date(date));
  }
  return delayAmount;
};

function useTimeLineInput(
  initialValue: TimeLineProps
): {
  hasApproved: boolean,
  value: ?Object,
  onChange: Function,
  onFocus: Function,
  onBlur: Function,
  handleApprove: (Object, Function) => void,
  handleUnapprove: Function => void,
  getTimeLine: (?Date) => any,
  isFocused: boolean,
  delayDays: number,
} {
  const [info, setInfo] = useState(initialValue);
  const [value, setValue] = useState(findLatestDate(initialValue));
  const hasApproved = initialValue.approvedBy && Object.keys(initialValue.approvedBy).length > 0;
  const [focus, setFocus] = useState(false);

  const onChange = useCallback((event: Object) => {
    if (event && event.currentTarget) {
      const newDate = new Date(event.currentTarget.value);
      if (Yup.date().isValidSync(newDate)) setValue(newDate);
    }
  }, []);

  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const onBlur = useCallback(() => {
    setFocus(false);
  }, []);

  const handleApprove = useCallback(
    (user, cb) => {
      setInfo({
        ...info,
        approvedAt: new Date(),
        approvedBy: user,
      });
      if (cb) {
        cb({
          ...info,
          approvedAt: new Date(),
          approvedBy: user,
        });
      }
    },
    [info]
  );

  const handleUnapprove = useCallback(
    cb => {
      setInfo({
        ...info,
        approvedAt: null,
        approvedBy: null,
      });
      if (cb) {
        cb({
          ...info,
          approvedAt: null,
          approvedBy: null,
        });
      }
    },
    [info]
  );

  const getTimeLine = date => ({
    ...info,
    timelineDateRevisions: [
      ...(info && info.timelineDateRevisions
        ? info.timelineDateRevisions.filter(item => !!item.id)
        : []),
      {
        date,
        type: 'Other',
      },
    ],
  });

  return {
    hasApproved: !!hasApproved,
    value,
    onChange,
    onFocus,
    onBlur,
    handleApprove,
    handleUnapprove,
    getTimeLine,
    isFocused: focus,
    delayDays: findDelay(info.timelineDateRevisions || [], info.date),
  };
}

export default useTimeLineInput;
