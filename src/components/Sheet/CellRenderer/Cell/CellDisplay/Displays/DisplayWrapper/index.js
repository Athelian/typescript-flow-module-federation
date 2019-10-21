// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type Props = {
  children: React.Node,
  width?: string,
};

const defaultProps = {
  width: '100%',
};

const DisplayWrapper = ({ children, width }: Props) => (
  <div className={DisplayWrapperStyle(width)}>{children}</div>
);

DisplayWrapper.defaultProps = defaultProps;

export default DisplayWrapper;
