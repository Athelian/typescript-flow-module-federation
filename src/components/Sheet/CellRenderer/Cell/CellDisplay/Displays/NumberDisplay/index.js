// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from '../DisplayWrapper';

type Props = {
  value: number | null,
};

const NumberDisplay = ({ value }: Props) => {
  return (
    <DisplayWrapper>
      <span>
        <FormattedNumber value={value} />
      </span>
    </DisplayWrapper>
  );
};

export default NumberDisplay;
