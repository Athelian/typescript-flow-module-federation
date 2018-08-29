// @flow
import React from 'react';
import { DividerStyle } from './style';

type Props = {
  height: string,
  color: string,
};

const defaultProps = {
  height: '1px',
  color: 'GRAY_VERY_LIGHT',
};

const Divider = ({ height, color }: Props) => <div className={DividerStyle(height, color)} />;

Divider.defaultProps = defaultProps;

export default Divider;
