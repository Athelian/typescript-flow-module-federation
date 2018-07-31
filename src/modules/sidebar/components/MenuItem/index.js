// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItemStyle, IconStyle } from './style';

type Props = {
  isActive: boolean,
  setExpandedSubMenuId?: Function,
  name: React.Element<*>,
  path: string,
  activeIcon: any,
  inactiveIcon: any,
};

const MenuItem = ({
  isActive,
  setExpandedSubMenuId = () => {},
  path,
  name,
  activeIcon,
  inactiveIcon,
}: Props): React.Element<*> => (
  <Link tabIndex={-1} to={path} onClick={setExpandedSubMenuId} className={MenuItemStyle(isActive)}>
    <div className={IconStyle}>
      <FontAwesomeIcon icon={isActive ? activeIcon : inactiveIcon} fixedWidth />
    </div>
    {name}
  </Link>
);

MenuItem.defaultProps = {
  setExpandedSubMenuId: () => {},
};

export default MenuItem;
