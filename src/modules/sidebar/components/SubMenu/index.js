// @flow

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fasDropdown from '@fortawesome/fontawesome-pro-solid/faAngleRight';
import MenuItem from '../MenuItem';
import { SubMenuStyle, SubMenuItemStyle, SubMenuBodyStyle } from './style';
import { IconStyle } from '../MenuItem/style';

const SubMenu = ({
  id,
  name,
  inactiveIcon,
  activeIcon,
  isExpanded,
  setExpandedSubMenuId,
  activeLink,
  menuItems,
}: {
  id: number,
  name: React.Element<*>,
  inactiveIcon: any,
  activeIcon: any,
  isExpanded: boolean,
  setExpandedSubMenuId: Function,
  activeLink: string,
  menuItems: Array<{|
    name: React.Element<*>,
    activeIcon: any,
    inactiveIcon: any,
    path: string,
  |}>,
}) => {
  const menuItemCount = menuItems.length;
  const isActive = menuItems.some(item => activeLink.startsWith(item.path));
  const toggleExpansion = () => setExpandedSubMenuId(isExpanded ? null : id);

  return (
    <div className={SubMenuStyle}>
      <button
        type="button"
        tabIndex={-1}
        onClick={toggleExpansion}
        className={SubMenuItemStyle(isExpanded || isActive)}
      >
        <span />
        <div className={IconStyle}>
          <FontAwesomeIcon icon={isExpanded || isActive ? activeIcon : inactiveIcon} fixedWidth />
        </div>
        {name}
        <FontAwesomeIcon
          icon={fasDropdown}
          className={isExpanded || isActive ? 'active' : ''}
          fixedWidth
        />
      </button>
      <div className={SubMenuBodyStyle(isExpanded || isActive, menuItemCount)}>
        {menuItems.map(menuItem => (
          <MenuItem
            key={menuItem.path}
            {...menuItem}
            isActive={activeLink.startsWith(menuItem.path)}
            setExpandedSubMenuId={() => setExpandedSubMenuId(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SubMenu;
