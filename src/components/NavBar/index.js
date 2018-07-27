// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { NavBarStyle, ChildrenWrapperStyle, MandatoryStyle } from './style';

type Props = {
  children: React.Node,
};

function NavBar({ children }: Props) {
  return (
    <div className={NavBarStyle}>
      <div className={ChildrenWrapperStyle}>{children}</div>
      <div className={MandatoryStyle}>
        <div>
          <Icon icon="fasArchive" />
        </div>
        <div>
          <Icon icon="fasCheck" />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
