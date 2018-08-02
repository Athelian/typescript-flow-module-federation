// @flow
import * as React from 'react';
import { UIConsumer } from 'modules/ui';
import Settings from './components/Settings';
import { NavBarStyle, ChildrenStyle } from './style';

type Props = {
  children: React.Node,
};

function NavBar({ children }: Props) {
  return (
    <UIConsumer>
      {({ isSideBarExpanded }) => (
        <div className={NavBarStyle(isSideBarExpanded)}>
          <div className={ChildrenStyle}>{children}</div>
          <Settings />
        </div>
      )}
    </UIConsumer>
  );
}

export default NavBar;
