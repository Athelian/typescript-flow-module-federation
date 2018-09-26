// @flow
import * as React from 'react';
import { LoadingWrapperStyle, LoadingIconStyle } from './style';

const LoadingIcon = () => (
  <div className={LoadingWrapperStyle}>
    <div className={LoadingIconStyle} />
  </div>
);

export default LoadingIcon;
