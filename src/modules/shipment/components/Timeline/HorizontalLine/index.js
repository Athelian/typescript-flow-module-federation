// @flow
import React from 'react';
import { LineStyle } from './style';

type Props = {
  color: string,
};

const HorizontalLine = ({ color }: Props) => <div className={LineStyle(color)} />;

export default HorizontalLine;
