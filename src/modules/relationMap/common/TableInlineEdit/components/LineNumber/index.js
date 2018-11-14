// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { LineNumberStyle } from './style';

type OptionalProps = {
  line: number,
};

type Props = OptionalProps & {
  height: number,
};

const defaultProps = {
  line: 0,
};

export default function LineNumber({ line, height }: Props) {
  return (
    <div className={LineNumberStyle} style={{ height }}>
      <FormattedNumber value={line} />
    </div>
  );
}

LineNumber.defaultProps = defaultProps;
