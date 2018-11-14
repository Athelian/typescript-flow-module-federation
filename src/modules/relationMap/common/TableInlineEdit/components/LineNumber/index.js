// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { LineNumberStyle } from './style';

type OptionalProps = {
  line: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  line: 0,
};

export default function LineNumber({ line }: Props) {
  return (
    <div className={LineNumberStyle}>
      <FormattedNumber value={line} />
    </div>
  );
}

LineNumber.defaultProps = defaultProps;
