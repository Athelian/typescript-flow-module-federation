// @flow
import * as React from 'react';
import { LoadingWrapperStyle, LoadingIconStyle } from './style';

type Props = {
  size: number,
};

const defaultProps = {
  size: 30,
};

const LoadingIcon = ({ size }: Props) => (
  <div className={LoadingWrapperStyle} id="loadingIcon">
    <div className={LoadingIconStyle(size)} />
  </div>
);

LoadingIcon.defaultProps = defaultProps;

export default LoadingIcon;
