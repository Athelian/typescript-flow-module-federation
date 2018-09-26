// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import { MenuItemStyle, IconStyle } from './style';

type Props = {
  isActive: boolean,
  onClick: () => void,
  path: string,
  icon: string,
  label: React.Node,
};

const MenuItem = ({ isActive, onClick, path, icon, label }: Props): React.Node => (
  <Link tabIndex={-1} to={path} onClick={onClick} className={MenuItemStyle(isActive)}>
    <span />
    <div className={IconStyle}>
      <Icon icon={icon} />
    </div>
    {label}
  </Link>
);

export default MenuItem;
