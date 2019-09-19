// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import { MenuItemStyle, IconStyle } from './style';

type Props = {
  path: string,
  isActive: boolean,
  icon: string,
  label: React.Node,
};

const MenuItem = ({ path, isActive, icon, label }: Props): React.Node => (
  <Link tabIndex={-1} to={path} className={MenuItemStyle(isActive)}>
    <span />

    <div className={IconStyle}>
      <Icon icon={icon} />
    </div>

    {label}
  </Link>
);

export default MenuItem;
