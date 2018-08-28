// @flow
import React from 'react';
import { DividerStyle } from './style';

type Props = {
  lineWidth?: string,
  color?: string,
};

const Divider = ({ lineWidth, color }: Props) => <div className={DividerStyle(lineWidth, color)} />;

export default Divider;
