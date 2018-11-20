// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';
import differenceInDays from 'date-fns/differenceInDays';

type TimeLineProps = {
  approvedBy?: {
    firstName: string,
    lastName: string,
  },
  date: ?Date,
  timelineDateRevisions?: Array<{
    date: ?Date,
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
    delayAmount = differenceInDays(new Date(shownDate), new Date(date));
  }
  return delayAmount;
};

function useTimeLineInput(initialValue: TimeLineProps) {
  const [info, setInfo] = useState(initialValue);
  const [value, setValue] = useState(findLatestDate(initialValue));
  const hasApproved = initialValue.approvedBy && Object.keys(initialValue.approvedBy).length > 0;
  const [focus, setFocus] = useState(false);

  const onChange = useCallback(event => {
    setValue(new Date(event.currentTarget.value));
  }, []);

  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const onBlur = useCallback(() => {
    setFocus(false);
  }, []);

  const handleApprove = useCallback((user, cb) => {
    setInfo({
      ...info,
      approvedAt: new Date(),
      approvedBy: user,
    });
    cb({
      ...info,
      approvedAt: new Date(),
      approvedBy: user,
    });
  }, []);

  const handleUnapprove = useCallback(cb => {
    setInfo({
      ...info,
      approvedAt: null,
      approvedBy: null,
    });
    cb({
      ...info,
      approvedAt: null,
      approvedBy: null,
    });
  }, []);

  const getTimeLine = useCallback(
    date => ({
      ...info,
      timelineDateRevisions: [
        ...info.timelineDateRevisions.filter(item => !!item.id),
        {
          date,
          type: 'Other',
        },
      ],
    }),
    []
  );

  return {
    hasApproved,
    value,
    onChange,
    onFocus,
    onBlur,
    handleApprove,
    handleUnapprove,
    getTimeLine,
    isFocused: focus,
    delayDays: findDelay(info.timelineDateRevisions, info.date),
  };
}

export default useTimeLineInput;
