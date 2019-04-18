// @flow

import * as React from 'react';
import { navigate } from '@reach/router';
import Icon from 'components/Icon';
import {
  SubMenuWrapperStyle,
  SubMenuItemWrapperStyle,
  SubMenuItemStyle,
  ChevronButtonStyle,
  SubMenuBodyStyle,
} from './style';
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
  const menuItems = React.Children.toArray(children);

  const menuItemCount = menuItems.filter(child => React.isValidElement(child)).length;

  const firstChildPath = menuItems.length > 0 ? menuItems[0].props.path : '/';

  let debounceHover = null;

  return (
    <div className={SubMenuWrapperStyle}>
      <div
        className={SubMenuItemWrapperStyle(isExpanded || hasActiveChild)}
        onClick={() => {
          onClick(isExpanded && !hasActiveChild ? null : id);
          navigate(firstChildPath);
        }}
        role="presentation"
      >
        <span />

        <div
          className={SubMenuItemStyle}
          onMouseEnter={() => {
            if (!isExpanded && !hasActiveChild) {
              debounceHover = setTimeout(() => onClick(id), 700);
            }
          }}
          onMouseLeave={() => {
            if (debounceHover) {
              clearTimeout(debounceHover);
            }
          }}
        >
          <div className={IconStyle}>
            <Icon icon={icon} />
          </div>

          {label}
        </div>

        <div
          className={ChevronButtonStyle(isExpanded || hasActiveChild, hasActiveChild)}
          onClick={evt => {
            evt.stopPropagation();
            onClick(isExpanded && !hasActiveChild ? null : id);
          }}
          role="presentation"
        >
          <Icon icon="CHEVRON_DOWN" />
        </div>
      </div>

      <div className={SubMenuBodyStyle(isExpanded || hasActiveChild, menuItemCount)}>
        {children}
      </div>
    </div>
  );
};

export default SubMenu;
