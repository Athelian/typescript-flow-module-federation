// @flow
import * as React from 'react';
import { ContentWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const Content = ({ children }: Props) => {
  return <div className={ContentWrapperStyle}>{children}</div>;
};

export default Content;
