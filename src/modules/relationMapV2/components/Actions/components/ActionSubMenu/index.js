// @flow
import * as React from 'react';
import { ActionSubMenuWrapperStyle } from './style';

type Props = {
  isCollapsed: boolean,
  children: React.Node,
};

export default function ActionSubMenu({ isCollapsed, children }: Props) {
  return (
    <div
      className={ActionSubMenuWrapperStyle(isCollapsed, React.Children.toArray(children).length)}
      onClick={e => e.stopPropagation()}
      role="presentation"
    >
      {children}
    </div>
  );
}
