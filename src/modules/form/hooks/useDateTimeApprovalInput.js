// @flow

import { useState, useCallback } from 'react';
import * as Yup from 'yup';

type Props = {
  approvedBy?: {
    firstName: string,
    lastName: string,
  },
  date: ?Date,
};

function useDateTimeApprovalInput(
  initialValue: Props
): {
  hasApproved: boolean,
  value: ?Object,
  onChange: Function,
  onFocus: Function,
  onBlur: Function,
  handleApprove: (Object, Function) => void,
  handleUnapprove: Function => void,
  isFocused: boolean,
} {
  const [info, setInfo] = useState(initialValue);
  const [value, setValue] = useState(initialValue.date);
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

  return {
    hasApproved: !!hasApproved,
    value,
    onChange,
    onFocus,
    onBlur,
    handleApprove,
    handleUnapprove,
    isFocused: focus,
  };
}

export default useDateTimeApprovalInput;
