// @flow
import * as React from 'react';

type OptionalProps = {
  line: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  line: 0,
};

export default function LineNumber({ line }: Props) {
  return <div>{line > 0 ? line : ''}</div>;
}

LineNumber.defaultProps = defaultProps;
