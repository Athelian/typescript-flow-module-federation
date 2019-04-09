// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import iconWhite from 'media/icon_white.png';
import logoWhite from 'media/logo_white.png';
import {
  LogoWrapperStyle,
  LogoButtonWrapperStyle,
  IconStyle,
  LogoStyle,
  ToggleButtonStyle,
} from './style';

type Props = { isSideBarExpanded: boolean, toggleSideBarExpansion: Function };

const Logo = ({ isSideBarExpanded, toggleSideBarExpansion }: Props) => (
  <div className={LogoWrapperStyle}>
    <Link to="/" className={LogoButtonWrapperStyle}>
      <div className={IconStyle}>
        <img src={iconWhite} alt="brand logo" />
      </div>
      <div className={LogoStyle}>
        <img src={logoWhite} alt="brand name logo" />
      </div>
    </Link>
    <button
      type="button"
      className={ToggleButtonStyle}
      tabIndex={-1}
      onClick={toggleSideBarExpansion}
    >
      <Icon icon={isSideBarExpanded ? 'TOGGLE_ON' : 'TOGGLE_OFF'} />
    </button>
  </div>
);

export default Logo;
