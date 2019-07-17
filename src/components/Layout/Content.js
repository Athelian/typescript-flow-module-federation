// @flow
import React from 'react';
import { ContentWrapperStyle } from './style';

type Props = {
  children: any,
};

const Content = ({ children }: Props) => {
  return <div className={ContentWrapperStyle}>{children}</div>;
};

export default Content;
