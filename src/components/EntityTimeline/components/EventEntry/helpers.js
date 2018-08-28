// @flow
import * as React from 'react';
import { isDataType } from 'utils/fp';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';

type Props = {
  value: any,
};

const dateReg = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
const numberReg = /^\d+$/;

const FormatValue = ({ value }: Props) => {
  if (isDataType(String, value)) {
    if (dateReg.test(value)) {
      return <FormattedDate value={value} />;
    }
    if (numberReg.test(value)) {
      return <FormattedNumber value={value} />;
    }

    return value;
  }
  if (isDataType(Number, value)) {
    return <FormattedNumber value={value} />;
  }

  return value;
};

export default FormatValue;
