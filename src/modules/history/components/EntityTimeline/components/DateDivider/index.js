// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import { DateDividerWrapperStyle, DateStyle } from './style';

type Props = {
  date: Date | string,
};

const DateDivider = ({ date }: Props) => (
  <div className={DateDividerWrapperStyle}>
    <div className={DateStyle}>
      <FormattedDate value={date} />
    </div>
  </div>
);

export default DateDivider;
