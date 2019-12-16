// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import NavigateLink from 'components/NavigateLink';
import { MenuItemStyle, IconStyle, BetaStyle } from './style';

type Props = {
  path: string,
  isActive: boolean,
  isBeta?: boolean,
  icon: string,
  label: React.Node,
};

const MenuItem = ({ path, isActive, isBeta, icon, label }: Props): React.Node => (
  <NavigateLink to={path} className={MenuItemStyle(isActive)}>
    <span />

    <div className={IconStyle}>
      <Icon icon={icon} />
    </div>

    {label}

    {isBeta && <div className={BetaStyle}>BETA</div>}
  </NavigateLink>
);

export default MenuItem;
