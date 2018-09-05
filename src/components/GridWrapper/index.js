// @flow
import * as React from 'react';
import { GridWrapperStyle } from './style';

type OptionalProps = {
  direction: 'row' | 'column',
  gap: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  direction: 'column',
  gap: '20px',
};

function GridWrapper({ children, direction, gap }: Props) {
  return (
    <div className={GridWrapperStyle(direction, gap)}>
      {React.Children.map(children, child => child)}
    </div>
  );
}

GridWrapper.defaultProps = defaultProps;

export default GridWrapper;
