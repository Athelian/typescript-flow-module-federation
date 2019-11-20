// @flow
import * as React from 'react';
import { LoadingWrapperStyle, LoadingIconStyle } from './style';

const LoadingIcon = ({ size }: Props) => (
  <div className={LoadingWrapperStyle} id="loadingIcon">
    <div className={LoadingIconStyle(size || 30)} />
  </div>
);

export default LoadingIcon;
