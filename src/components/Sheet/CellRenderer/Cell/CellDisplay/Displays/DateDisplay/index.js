// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import DisplayWrapper from '../DisplayWrapper';

type Props = {
  value: Date | string | null,
};

const DateDisplay = ({ value }: Props) => {
  return (
    <DisplayWrapper>
      <span>
        <FormattedDate value={value} />
      </span>
    </DisplayWrapper>
  );
};

export default DateDisplay;
