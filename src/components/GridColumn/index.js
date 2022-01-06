// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { GridColumnWrapperStyle, GridCenteredStyle } from './style';

type OptionalProps = {
  gap: string,
  centered?: boolean,
  maxWidth?: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  gap: '20px',
};

function GridColumn({ children, gap, maxWidth, centered, ...rest }: Props) {
  return (
    <div
      className={cx(GridColumnWrapperStyle(gap, maxWidth), { [GridCenteredStyle]: centered })}
      {...rest}
    >
      {children}
    </div>
  );
}

GridColumn.defaultProps = defaultProps;

export default GridColumn;
