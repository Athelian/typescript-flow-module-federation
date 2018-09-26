// @flow

import * as React from 'react';
import Icon from 'components/Icon';
import { SubMenuStyle, SubMenuItemStyle, ChevronStyle, SubMenuBodyStyle } from './style';
import { IconStyle } from '../MenuItem/style';

type Props = {
  isExpanded: boolean,
  hasActiveChild: boolean,
  onClick: (?string) => void,
  id: string,
  icon: string,
  label: React.Node,
  children: React.Node,
};

const SubMenu = ({ isExpanded, hasActiveChild, onClick, id, icon, label, children }: Props) => {
  const menuItemCount = children.length;

  return (
    <div className={SubMenuStyle}>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => onClick(isExpanded && !hasActiveChild ? null : id)}
        className={SubMenuItemStyle(isExpanded || hasActiveChild)}
      >
        <span />
        <div className={IconStyle}>
          <Icon icon={icon} />
        </div>

        {label}

        <div className={ChevronStyle(isExpanded || hasActiveChild)}>
          <Icon icon="CHEVRON_DOWN" />
        </div>
      </button>

      <div className={SubMenuBodyStyle(isExpanded || hasActiveChild, menuItemCount)}>
        {children}
      </div>
    </div>
  );
};

export default SubMenu;
