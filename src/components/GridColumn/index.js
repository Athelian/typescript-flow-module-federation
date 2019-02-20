// @flow
import * as React from 'react';
import { GridColumnWrapperStyle } from './style';

type OptionalProps = {
  gap: string,
  maxWidth?: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  gap: '20px',
};

function GridColumn({ children, gap, maxWidth, ...rest }: Props) {
  return (
    <div className={GridColumnWrapperStyle(gap, maxWidth)} {...rest}>
      {children}
    </div>
  );
}

GridColumn.defaultProps = defaultProps;

export default GridColumn;
