// @flow
import * as React from 'react';
import { GrayCardStyle } from './style';

export type CardProps = {
  width: string,
  height: string,
};

const GrayCard = ({ width, height }: CardProps) => (
  <div className={GrayCardStyle({ width, height })} />
);

export default GrayCard;
