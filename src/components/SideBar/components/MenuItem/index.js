// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import { MenuItemStyle, IconStyle, BetaStyle } from './style';

type Props = {
  path: string,
  isActive: boolean,
  isBeta?: boolean,
  icon: string,
  label: React.Node,
};

const MenuItem = ({ path, isActive, isBeta, icon, label }: Props): React.Node => (
  // $FlowFixMe Flow typed is not updated yet
  <Link tabIndex={-1} to={path} className={MenuItemStyle(isActive)}>
    <span />

    <div className={IconStyle}>
      <Icon icon={icon} />
    </div>

    {label}

    {isBeta && <div className={BetaStyle}>BETA</div>}
  </Link>
);

export default MenuItem;
