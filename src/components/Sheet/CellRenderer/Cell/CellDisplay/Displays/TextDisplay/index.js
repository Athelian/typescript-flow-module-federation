// @flow
import * as React from 'react';
import DisplayWrapper from '../DisplayWrapper';

type Props = {
  value: string | null,
};

const TextDisplay = ({ value }: Props) => {
  return (
    <DisplayWrapper>
      <span>{value}</span>
    </DisplayWrapper>
  );
};

export default TextDisplay;
