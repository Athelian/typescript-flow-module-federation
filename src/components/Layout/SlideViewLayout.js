// @flow
import * as React from 'react';
import { DesktopWrapperStyle } from 'styles/main';
import { LayoutWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const SlideViewLayout = ({ children }: Props) => {
  return (
    <div className={DesktopWrapperStyle()}>
      <div className={LayoutWrapperStyle}>{children}</div>
    </div>
  );
};

export default SlideViewLayout;
