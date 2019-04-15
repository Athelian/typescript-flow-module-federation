// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import type { DateItem } from 'modules/timeline/types';
import { DateStyle, DaySeparatorWrapperStyle, SeparatorStyle } from './style';

type Props = {
  date: DateItem,
};

const DateSeparator = ({ date }: Props) => {
  return (
    <div className={DaySeparatorWrapperStyle}>
      <div className={SeparatorStyle} />
      <span className={DateStyle}>
        <FormattedDate value={date.date} />
      </span>
      <div className={SeparatorStyle} />
    </div>
  );
};

export default DateSeparator;
