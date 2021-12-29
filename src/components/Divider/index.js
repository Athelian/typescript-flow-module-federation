// @flow
import React from 'react';
import { DividerStyle } from './style';

type Props = {
  height: string,
  color: string,
  margin: string,
};

const defaultProps = {
  height: '1px',
  color: 'GRAY_VERY_LIGHT',
  margin: '0px',
};

const Divider = ({ height, color, margin }: Props) => (
  <div className={DividerStyle(height, color, margin)} />
);

Divider.defaultProps = defaultProps;

export default Divider;
