// @flow
import * as React from 'react';
import { GridRowWrapperStyle } from './style';

type OptionalProps = {
  gap: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  gap: '20px',
};

function GridRow({ children, gap }: Props) {
  return <div className={GridRowWrapperStyle(gap)}>{children}</div>;
}

GridRow.defaultProps = defaultProps;

export default GridRow;
