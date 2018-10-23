// @flow
import * as React from 'react';
import { isDataType } from 'utils/fp';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';

type Props = {
  value: any,
};

const dateReg = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
const numberReg = /^\d+$/;

const FormatValue = ({ value }: Props) => {
  if (value) {
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

    if (isDataType(Object, value)) {
      if (Object.keys(value).length === 1 && value.metric) return value.metric;
      if (Object.keys(value).length === 2 && value.value)
        return (
          <>
            <FormattedNumber value={value.value} /> {value.metric}
          </>
        );
      return JSON.stringify(value);
    }
  }
  return ' ';
};

export default FormatValue;
